package trait

import (
	"context"
	srv "core/internal/infra/server"
	rsc "core/internal/pkg/resource"
	"core/pkg/dbutil"
)

func listResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) (*[]Trait, error) {
	var o []Trait
	sqlStatement := `
SELECT
  t.id,
  t.key,
  t.is_identifier
FROM trait t
LEFT JOIN environment e
  ON e.id = t.environment_id
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
		var _o Trait
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.IsIdentifier,
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
	i Trait,
	a RootArgs,
) (*Trait, error) {
	var o Trait
	sqlStatement := `
INSERT INTO
  trait(
    key,
    is_identifier,
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
        ON w.id = p.workspace_id
      WHERE w.key = $3
        AND p.key = $4
        AND e.key = $5
    )
  )
RETURNING
  id,
  key,
  is_identifier;`
	err := dbutil.ParseError(
		rsc.Trait.String(),
		ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
			TraitKey:       i.Key,
		},
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.IsIdentifier,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.IsIdentifier,
		),
	)
	return &o, err
}

func getResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
) (*Trait, error) {
	var o Trait
	sqlStatement := `
SELECT
  t.id,
  t.key,
  t.is_identifier
FROM trait t
LEFT JOIN environment e
  ON e.id = t.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND t.key = $4`
	err := dbutil.ParseError(
		rsc.Trait.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.TraitKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.IsIdentifier,
		),
	)
	return &o, err
}

func updateResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Trait,
	a ResourceArgs,
) (*Trait, error) {
	sqlStatement := `
UPDATE trait
SET
  key = $2,
  is_identifier = $3
WHERE id = $1`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Key,
		i.IsIdentifier,
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Trait.String(),
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
DELETE FROM trait
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
		a.TraitKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Trait.String(),
			a,
			err,
		)
	}
	return nil
}
