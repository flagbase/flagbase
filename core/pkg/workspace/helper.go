package workspace

import (
	"context"
	"core/internal/db"
	"fmt"
)

// getWorkspaceByKey retrieve a workspace given its unique key
func getWorkspaceByKey(key string) (*Workspace, error) {
	var w Workspace
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    key, name, description, tags
  FROM
    workspace
  WHERE
    key = $1
  `, key)
	if err := row.Scan(
		&w.Key,
		&w.Name,
		&w.Description,
		&w.Tags,
	); err != nil {
		return &w, fmt.Errorf("Unable to find workspace with key %s", key)
	}

	return &w, nil
}
