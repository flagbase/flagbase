package workspace

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getResource(workspaceKey rsc.Key) (*Workspace, error) {
	var w Workspace
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    id, key, name, description, tags
  FROM
    workspace
  WHERE
    key = $1
  `, workspaceKey)
	if err := row.Scan(
		&w.ID,
		&w.Key,
		&w.Name,
		&w.Description,
		&w.Tags,
	); err != nil {
		return &w, fmt.Errorf("unable to find workspace with key %s", workspaceKey)
	}

	return &w, nil
}
