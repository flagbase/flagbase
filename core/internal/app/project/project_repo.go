package project

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/dbutil"

	"github.com/lib/pq"
)

func listResource(
	sctx *srv.Ctx,
	ctx context.Context,
	a RootArgs,
) (*[]Project, error) {
	var o []Project

	rows, err := sctx.DB.Query(ctx, `
  SELECT
    p.id,
    p.key,
    p.name,
    p.description,
    p.tags
  FROM project p
  LEFT JOIN workspace w
  ON    p.workspace_id = w.id
  WHERE w.key = $1
  `, a.WorkspaceKey)
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
	sctx *srv.Ctx,
	ctx context.Context,
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
    tags;
	`
	err := dbutil.ParseError(
		rsc.Project.String(),
		ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   i.Key,
		},
		sctx.DB.QueryRow(
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
	sctx *srv.Ctx,
	ctx context.Context,
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
  FROM      project p
  LEFT JOIN workspace w
  ON    p.workspace_id = w.id
  WHERE w.key = $1
  AND   p.key = $2
	`
	err := dbutil.ParseError(
		rsc.Access.String(),
		a,
		sctx.DB.QueryRow(
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
	sctx *srv.Ctx,
	ctx context.Context,
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
  WHERE id = $1
	`
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
			rsc.Project.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func deleteResource(
	sctx *srv.Ctx,
	ctx context.Context,
	a ResourceArgs,
) error {
	sqlStatement := `
  DELETE FROM project
  WHERE workspace_id = (
    SELECT id
    FROM workspace
    WHERE key = $1
  ) AND key = $2
	`
	if _, err := sctx.DB.Exec(
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
