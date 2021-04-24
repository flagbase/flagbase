package identity

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/dbutil"
)

func listResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) (*[]Identity, error) {
	var o []Identity
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
		var _o Identity
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

func createResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Identity,
	a RootArgs,
) (*Identity, error) {
	var o Identity
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
		ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
			IdentityKey:    i.Key,
		},
		sctx.DB.QueryRow(
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

func getResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
) (*Identity, error) {
	var o Identity
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
		sctx.DB.QueryRow(
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

func updateResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Identity,
	a ResourceArgs,
) (*Identity, error) {
	sqlStatement := `
UPDATE identity
SET
  key = $2
WHERE id = $1`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
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

func deleteResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
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
	if _, err := sctx.DB.Exec(
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
