package project

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"fmt"
)

func getResource(
	sctx *srv.Ctx,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*Project, error) {
	var o Project
	row := sctx.DB.QueryRow(context.Background(), `
  SELECT
    p.id, p.key, p.name, p.description, p.tags
  FROM
    workspace w, project p
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    p.workspace_id = w.id
  `, workspaceKey, projectKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		return &o, fmt.Errorf("unable to find project with key %s", projectKey)
	}

	return &o, nil
}
