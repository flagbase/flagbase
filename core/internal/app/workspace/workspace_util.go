package workspace

import (
	"context"
	"core/pkg/db"
	rsc "core/internal/pkg/resource"
	"fmt"
)

func getResource(workspaceKey rsc.Key) (*Workspace, error) {
	var o Workspace
	row := db.Pool.QueryRow(context.Background(), `
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
