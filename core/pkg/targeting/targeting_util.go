package targeting

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getResource(
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
	environmentKey rsc.Key,
) (*Targeting, error) {
	var o Targeting
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    t.id, t.enabled, v.key
  FROM
    workspace w,
    project p,
    environment e,
    flag f,
    targeting t,
    variation v
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    f.key = $3 AND
    e.key = $4 AND
    p.workspace_id = w.id AND
    f.project_key = p.id AND
    e.workspace_id = w.id AND
    t.environment_id = e.id AND
    t.flag_id = f.id AND
    t.fallthrough_variation_id = v.id
  `, workspaceKey, projectKey, flagKey, environmentKey)
	if err := row.Scan(
		&o.ID,
		&o.Enabled,
		&o.FallthroughVariationKey,
	); err != nil {
		return &o, fmt.Errorf(
			"unable to find targeting object given workspaceKey = %s, projectKey = %s, flagKey = %s, environmentKey = %s",
			workspaceKey,
			projectKey,
			flagKey,
			environmentKey,
		)
	}

	return &o, nil
}
