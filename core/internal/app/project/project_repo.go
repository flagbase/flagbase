package project

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"

	"github.com/lib/pq"
)

func listResource(
	ctx context.Context,
	senv *srvenv.Env,
	a RootArgs,
) (*[]Project, error) {
	var o []Project
	sqlStatement := `
SELECT
  p.id,
  p.key,
  p.name,
  p.description,
  p.tags
FROM project p
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1`
	rows, err := senv.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o Project
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
	senv *srvenv.Env,
	i Project,
	a RootArgs,
) (*Project, error) {
	var o Project
	sqlStatement := `
INSERT INTO
  project(
    key,
    name,
    description,
    tags,
    workspace_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    (
      SELECT id
      FROM workspace
      WHERE key = $5
    )
  )
RETURNING
  id,
  key,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.Project.String(),
		ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   i.Key,
		},
		senv.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			a.WorkspaceKey,
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
	senv *srvenv.Env,
	a ResourceArgs,
) (*Project, error) {
	var o Project
	sqlStatement := `
SELECT
  p.id,
  p.key,
  p.name,
  p.description,
  p.tags
FROM project p
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2`
	err := dbutil.ParseError(
		rsc.Project.String(),
		a,
		senv.DB.QueryRow(
			ctx,
			sqlStatement,
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

func updateResource(
	ctx context.Context,
	senv *srvenv.Env,
	i Project,
	a ResourceArgs,
) (*Project, error) {
	sqlStatement := `
UPDATE project
SET
  key = $2,
  name = $3,
  description = $4,
  tags = $5
WHERE id = $1`
	if _, err := senv.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Project.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func deleteResource(
	ctx context.Context,
	senv *srvenv.Env,
	a ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM project
WHERE key = $2
  AND workspace_id = (
    SELECT id
    FROM workspace
    WHERE key = $1
  )`
	if _, err := senv.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Project.String(),
			a,
			err,
		)
	}
	return nil
}
