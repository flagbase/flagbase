package identity

import (
	"context"
	identitymodel "core/internal/app/identity/model"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"

	"github.com/jackc/pgx/v4/pgxpool"
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
	a identitymodel.RootArgs,
) (*[]identitymodel.Identity, error) {
	var o []identitymodel.Identity
	sqlStatement := `
SELECT
  i.id,
  i.key
FROM identity i
LEFT JOIN environment e
  ON e.id = i.environment_id
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
		var _o identitymodel.Identity
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
		); err != nil {
			return nil, err
		}
		o = append(o, _o)
	}
	return &o, nil
}

func (r *Repo) Create(
	ctx context.Context,
	i identitymodel.Identity,
	a identitymodel.RootArgs,
) (*identitymodel.Identity, error) {
	var o identitymodel.Identity
	sqlStatement := `
INSERT INTO
  identity(
    key,
    environment_id
  )
VALUES
  (
    $1,
    $2,
    (
      SELECT e.id
      FROM environment e
      LEFT JOIN project p
        ON p.id = e.project_id
      LEFT JOIN workspace w
        ON p.workspace_id = w.id
      WHERE w.key = $3
        AND p.key = $4
        AND e.key = $5
    )
  )
RETURNING
  id,
  key;`
	err := dbutil.ParseError(
		rsc.Identity.String(),
		identitymodel.ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
			IdentityKey:    i.Key,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
		).Scan(
			&o.ID,
			&o.Key,
		),
	)
	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	a identitymodel.ResourceArgs,
) (*identitymodel.Identity, error) {
	var o identitymodel.Identity
	sqlStatement := `
SELECT
  i.id,
  i.key
FROM identity i
LEFT JOIN environment e
  ON e.id = i.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND i.key = $4`
	err := dbutil.ParseError(
		rsc.Identity.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.IdentityKey,
		).Scan(
			&o.ID,
			&o.Key,
		),
	)
	return &o, err
}

func (r *Repo) Update(
	ctx context.Context,
	i identitymodel.Identity,
	a identitymodel.ResourceArgs,
) (*identitymodel.Identity, error) {
	sqlStatement := `
UPDATE identity
SET
  key = $2
WHERE id = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		i.ID,
		i.Key,
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Identity.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a identitymodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM identity
WHERE key = $4
  AND environment_id = (
    SELECT e.id
    FROM environment e
    LEFT JOIN project p
      ON p.id = e.project_id
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $1
      AND p.key = $2
      AND e.key = $3
  )`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.IdentityKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Identity.String(),
			a,
			err,
		)
	}
	return nil
}
