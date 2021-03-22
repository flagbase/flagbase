package segment

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/pkg/db"
	"fmt"
)

func getResource(workspaceKey rsc.Key, projectKey rsc.Key, segmentKey rsc.Key) (*Segment, error) {
	var o Segment
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    s.id, s.key, s.name, s.description, s.tags
  FROM
    workspace w, project p, segment s
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    s.key = $3 AND
    p.workspace_id = w.id AND
    s.project_id = p.id
  `, workspaceKey, projectKey, segmentKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		return &o, fmt.Errorf("unable to find segment with key %s", segmentKey)
	}

	return &o, nil
}
