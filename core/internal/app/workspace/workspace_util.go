package workspace

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"fmt"
)

func getResource(
	sctx *srv.Ctx,
	workspaceKey rsc.Key,
) (*Workspace, error) {
	var o Workspace
	row := sctx.DB.QueryRow(context.Background(), `
  SELECT
    id, key, name, description, tags
  FROM
    workspace
  WHERE
    key = $1
  `, workspaceKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		return &o, fmt.Errorf("unable to find workspace with key %s", workspaceKey)
	}

	return &o, nil
}
