package flag

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getResource(workspaceKey rsc.Key, projectKey rsc.Key, flagKey rsc.Key) (*Flag, error) {
	var o Flag
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    f.id, f.key, f.name, f.description, f.tags
  FROM
    workspace w, project p, flag f
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    f.key = $3 AND
    p.workspace_id = w.id AND
    f.project_id = p.id
  `, workspaceKey, projectKey, flagKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		return &o, fmt.Errorf("unable to find flag with key %s", flagKey)
	}

	return &o, nil
}
