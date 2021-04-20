package workspace

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
) (*[]Workspace, error) {
	var o []Workspace

	rows, err := sctx.DB.Query(ctx, `
  SELECT
    id,
    key,
    name,
    description,
    tags
  FROM workspace
  `)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var _o Workspace
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
	i Workspace,
	a RootArgs,
) (*Workspace, error) {
	var o Workspace

	sqlStatement := `
  INSERT INTO
    workspace(
      key,
      name,
      description,
      tags
    )
  VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
  RETURNING
    id,
    key,
    name,
    description,
    tags;
	`
	err := dbutil.ParseError(
		rsc.Workspace.String(),
		ResourceArgs{
			WorkspaceKey: i.Key,
		},
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
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
) (*Workspace, error) {
	var o Workspace

	sqlStatement := `
  SELECT
    id,
    key,
    name,
    description,
    tags
  FROM workspace
  WHERE key = $1
	`
	err := dbutil.ParseError(
		rsc.Workspace.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
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

func updateResource(
	sctx *srv.Ctx,
	ctx context.Context,
	i Workspace,
	a ResourceArgs,
) (*Workspace, error) {
	sqlStatement := `
  UPDATE workspace
  SET
    key = $2,
    name = $3,
    description = $4,
    tags = $5
  WHERE key = $1
	`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey.String(),
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Workspace.String(),
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
  DELETE FROM workspace
  WHERE key = $1
	`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Workspace.String(),
			a,
			err,
		)
	}
	return nil
}
