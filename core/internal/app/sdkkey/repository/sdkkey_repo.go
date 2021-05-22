package repository

import (
	"context"
	sdkkeymodel "core/internal/app/sdkkey/model"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"
	"errors"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lib/pq"
)

type Repo struct {
	DB *pgxpool.Pool
}

func NewRepo(senv *srvenv.Env) *Repo {
	return &Repo{
		DB: senv.DB,
	}
}

func (r *Repo) List(
	ctx context.Context,
	a sdkkeymodel.RootArgs,
) ([]*sdkkeymodel.SDKKey, error) {
	var o []*sdkkeymodel.SDKKey
	sqlStatement := `
SELECT
  sk.id,
  sk.enabled,
  sk.client_key,
  sk.server_key,
  sk.expires_at,
  sk.name,
  sk.description,
  sk.tags
FROM sdk_key sk
LEFT JOIN environment e
  ON e.id = sk.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3`
	rows, err := r.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o sdkkeymodel.SDKKey
		if err = rows.Scan(
			&_o.ID,
			&_o.Enabled,
			&_o.ClientKey,
			&_o.ServerKey,
			&_o.ExpiresAt,
			&_o.Name,
			&_o.Description,
			&_o.Tags,
		); err != nil {
			return nil, err
		}
		o = append(o, &_o)
	}
	return o, nil
}

func (r *Repo) Create(
	ctx context.Context,
	i sdkkeymodel.SDKKey,
	a sdkkeymodel.RootArgs,
) (*sdkkeymodel.SDKKey, error) {
	var o sdkkeymodel.SDKKey
	sqlStatement := `
INSERT INTO
  sdk_key(
    enabled,
    expires_at,
    name,
    description,
    tags,
    environment_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    (
      SELECT e.id
      FROM environment e
      LEFT JOIN project p
        ON p.id = e.project_id
      LEFT JOIN workspace w
        ON p.workspace_id = w.id
      WHERE w.key = $6
        AND p.key = $7
        AND e.key = $8
    )
  )
RETURNING
  id,
  enabled,
  client_key,
  server_key,
  expires_at,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.SDKKey.String(),
		sdkkeymodel.ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Enabled,
			i.ExpiresAt,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
		).Scan(
			&o.ID,
			&o.Enabled,
			&o.ClientKey,
			&o.ServerKey,
			&o.ExpiresAt,
			&o.Name,
			&o.Description,
			&o.Tags,
		),
	)
	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	a sdkkeymodel.ResourceArgs,
) (*sdkkeymodel.SDKKey, error) {
	var o sdkkeymodel.SDKKey
	sqlStatement := `
SELECT
  sk.id,
  sk.enabled,
  sk.client_key,
  sk.server_key,
  sk.expires_at,
  sk.name,
  sk.description,
  sk.tags
FROM sdk_key sk
WHERE sk.id = $1`
	err := dbutil.ParseError(
		rsc.SDKKey.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			a.ID.String(),
		).Scan(
			&o.ID,
			&o.Enabled,
			&o.ClientKey,
			&o.ServerKey,
			&o.ExpiresAt,
			&o.Name,
			&o.Description,
			&o.Tags,
		),
	)
	return &o, err
}

func (r *Repo) Update(
	ctx context.Context,
	i sdkkeymodel.SDKKey,
	a sdkkeymodel.ResourceArgs,
) (*sdkkeymodel.SDKKey, error) {
	sqlStatement := `
UPDATE sdk_key
SET
  enabled = $2,
  expires_at = $3,
  name = $4,
  description = $5,
  tags = $6
WHERE id = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		i.ID,
		i.Enabled,
		i.ExpiresAt,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.SDKKey.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a sdkkeymodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM sdk_key
WHERE id = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.ID.String(),
	); err != nil {
		return dbutil.ParseError(
			rsc.Identity.String(),
			a,
			err,
		)
	}
	return nil
}

// -------- Custom Repository Handlers -------- //

func (r *Repo) GetRootArgsFromSDKKeyResource(
	ctx context.Context,
	sdkKey string,
) (*sdkkeymodel.RootArgs, error) {
	var o sdkkeymodel.RootArgs
	sqlStatement := `
SELECT
  w.key,
  p.key,
  e.key
FROM sdk_key sk
LEFT JOIN environment e
  ON e.id = sk.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE sk.client_key = $1
   OR sk.server_key = $1`
	err := dbutil.ParseError(
		rsc.SDKKey.String(),
		sdkkeymodel.SDKKey{
			ClientKey: sdkKey,
			ServerKey: sdkKey,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			sdkKey,
		).Scan(
			&o.WorkspaceKey,
			&o.ProjectKey,
			&o.EnvironmentKey,
		),
	)
	if (sdkkeymodel.RootArgs{}) == o {
		return &o, errors.New("cannot find SDK key")
	}
	return &o, err
}

func (r *Repo) GetRootArgsFromServerKeyResource(
	ctx context.Context,
	serverKey string,
) (*sdkkeymodel.RootArgs, error) {
	var o sdkkeymodel.RootArgs
	sqlStatement := `
SELECT
  w.key,
  p.key,
  e.key
FROM workspace w
LEFT JOIN project p
  ON p.workspace_id = w.id
LEFT JOIN environment e
  ON e.project_id = p.id
LEFT JOIN sdk_key sk
  ON sk.environment_id = e.id
WHERE sk.server_key = $1`
	err := dbutil.ParseError(
		rsc.SDKKey.String(),
		sdkkeymodel.SDKKey{
			ServerKey: serverKey,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			serverKey,
		).Scan(
			&o.WorkspaceKey,
			&o.ProjectKey,
			&o.EnvironmentKey,
		),
	)
	if (sdkkeymodel.RootArgs{}) == o {
		return &o, errors.New("cannot find SDK key - make sure your using the correct type of SDK key (i.e. server)")
	}
	return &o, err
}
