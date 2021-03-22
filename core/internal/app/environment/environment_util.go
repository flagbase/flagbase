package environment

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/pkg/db"
	"fmt"
)

func getResource(workspaceKey rsc.Key, projectKey rsc.Key, environmentKey rsc.Key) (*Environment, error) {
	var o Environment
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    e.id, e.key, e.name, e.description, e.tags
  FROM
    workspace w, project p, environment e
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    e.key = $3 AND
    p.workspace_id = w.id AND
    e.project_id = p.id
  `, workspaceKey, projectKey, environmentKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		return &o, fmt.Errorf("unable to find environment with key %s", environmentKey)
	}

	return &o, nil
}
