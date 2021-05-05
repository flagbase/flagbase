package sdkkey

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/dbutil"
	"errors"

	"github.com/lib/pq"
)

func listResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) (*[]SDKKey, error) {
	var o []SDKKey
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
	rows, err := sctx.DB.Query(
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
		var _o SDKKey
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
		o = append(o, _o)
	}
	return &o, nil
}

func createResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i SDKKey,
	a RootArgs,
) (*SDKKey, error) {
	var o SDKKey
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
		ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
		},
		sctx.DB.QueryRow(
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

func getResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
) (*SDKKey, error) {
	var o SDKKey
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
		sctx.DB.QueryRow(
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

func updateResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i SDKKey,
	a ResourceArgs,
) (*SDKKey, error) {
	sqlStatement := `
UPDATE sdk_key
SET
  enabled = $2,
  expires_at = $3,
  name = $4,
  description = $5,
  tags = $6
WHERE id = $1`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
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

func deleteResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM sdk_key
WHERE id = $1`
	if _, err := sctx.DB.Exec(
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

func getRootArgsFromSDKKeyResource(
	ctx context.Context,
	sctx *srv.Ctx,
	sdkKey string,
) (*RootArgs, error) {
	var o RootArgs
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
		SDKKey{
			ClientKey: sdkKey,
			ServerKey: sdkKey,
		},
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			sdkKey,
		).Scan(
			&o.WorkspaceKey,
			&o.ProjectKey,
			&o.EnvironmentKey,
		),
	)
	if (RootArgs{}) == o {
		return &o, errors.New("cannot find SDK key")
	}
	return &o, err
}

func getRootArgsFromServerKeyResource(
	ctx context.Context,
	sctx *srv.Ctx,
	serverKey string,
) (*RootArgs, error) {
	var o RootArgs
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
		SDKKey{
			ServerKey: serverKey,
		},
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			serverKey,
		).Scan(
			&o.WorkspaceKey,
			&o.ProjectKey,
			&o.EnvironmentKey,
		),
	)
	if (RootArgs{}) == o {
		return &o, errors.New("cannot find SDK key - make sure your using the correct type of SDK key (i.e. server)")
	}
	return &o, err
}
