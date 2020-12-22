package environment

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getResource(workspaceKey rsc.Key, environmentKey rsc.Key) (*Environment, error) {
	var w Environment
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    p.id, p.key, p.name, p.description, p.tags
  FROM
    environment p, workspace w
  WHERE
    w.key = $1 AND p.key = $2 AND p.workspace_id = w.id
  `, workspaceKey, environmentKey)
	if err := row.Scan(
		&w.ID,
		&w.Key,
		&w.Name,
		&w.Description,
		&w.Tags,
	); err != nil {
		return &w, fmt.Errorf("unable to find environment with key %s", environmentKey)
	}

	return &w, nil
}
