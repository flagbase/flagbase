package identity

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"fmt"
)

func getResource(
	sctx *srv.Ctx,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
	identityKey rsc.Key,
) (*Identity, error) {
	var o Identity
	row := sctx.DB.QueryRow(context.Background(), `
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
