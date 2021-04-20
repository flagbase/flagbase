package flag

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/dbutil"

	"github.com/lib/pq"
)

func listResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) (*[]Flag, error) {
	var o []Flag

	sqlStatement := `
SELECT
  f.id,
  f.key,
  f.name,
  f.description,
  f.tags
FROM flag f
LEFT JOIN project p
  ON f.project_id = p.id
LEFT JOIN workspace w
  ON p.workspace_id = w.id
WHERE w.key = $1
  AND p.key = $2`
	rows, err := sctx.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
	)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var _o Flag
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
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
	i Flag,
	a RootArgs,
) (*Flag, error) {
	var o Flag

	sqlStatement := `
INSERT INTO
  flag(
    key,
    name,
    description,
    tags,
    project_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    (
      SELECT
        p.id
      FROM project p
      LEFT JOIN workspace w
        ON p.workspace_id = w.id
      WHERE w.key = $5
        AND p.key = $6
    )
  )
RETURNING
  id,
  key,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.Flag.String(),
		ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			FlagKey:      i.Key,
		},
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			a.WorkspaceKey,
			a.ProjectKey,
		).Scan(
			&o.ID,
			&o.Key,
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
) (*Flag, error) {
	var o Flag

	sqlStatement := `
SELECT
  f.id,
  f.key,
  f.name,
  f.description,
  f.tags
FROM flag f
LEFT JOIN project p
  ON f.project_id = p.id
LEFT JOIN workspace w
  ON p.workspace_id = w.id
WHERE w.key = $1
  AND p.key = $2
  AND f.key = $3`
	err := dbutil.ParseError(
		rsc.Flag.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.FlagKey,
		).Scan(
			&o.ID,
			&o.Key,
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
	i Flag,
	a ResourceArgs,
) (*Flag, error) {
	sqlStatement := `
UPDATE
  flag
SET
  key = $2,
  name = $3,
  description = $4,
  tags = $5
WHERE id = $1`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Flag.String(),
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
DELETE FROM flag
WHERE key = $3
  AND project_id = (
    SELECT p.id
    FROM project p
    LEFT JOIN workspace w
      ON p.workspace_id = w.id
    WHERE w.key = $1
      AND p.key = $2
  )`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.FlagKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Flag.String(),
			a,
			err,
		)
	}
	return nil
}
