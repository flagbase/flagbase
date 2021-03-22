package trait

import (
	"context"
	"core/pkg/db"
	rsc "core/internal/pkg/resource"
	"fmt"
)

func getResource(
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
	traitKey rsc.Key,
) (*Trait, error) {
	var o Trait
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    t.id, t.key, t.is_identifier
  FROM
    workspace w, project p, environment e, trait t
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    e.key = $3 AND
    t.key = $4 AND
    p.workspace_id = w.id AND
    e.project_id = p.id AND
    t.environment_id = e.id
  `, workspaceKey, projectKey, environmentKey, traitKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.IsIdentifier,
	); err != nil {
		return &o, fmt.Errorf("unable to find trait with key %s", traitKey)
	}

	return &o, nil
}
