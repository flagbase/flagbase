package identity

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/pkg/db"
	"fmt"
)

func getResource(
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
	identityKey rsc.Key,
) (*Identity, error) {
	var o Identity
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    i.id, i.key
  FROM
    workspace w, project p, environment e, identity i
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    e.key = $3 AND
    i.key = $4 AND
    p.workspace_id = w.id AND
    e.project_id = p.id AND
    i.environment_id = e.id
  `, workspaceKey, projectKey, environmentKey, identityKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
	); err != nil {
		return &o, fmt.Errorf("unable to find identity with key %s", identityKey)
	}

	return &o, nil
}
