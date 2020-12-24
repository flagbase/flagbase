package project

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getResource(workspaceKey rsc.Key, projectKey rsc.Key) (*Project, error) {
	var o Project
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    p.id, p.key, p.name, p.description, p.tags
  FROM
    project p, workspace w
  WHERE
    w.key = $1 AND p.key = $2 AND p.workspace_id = w.id
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
