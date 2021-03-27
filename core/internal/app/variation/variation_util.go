package variation

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
	flagKey rsc.Key,
	variationKey rsc.Key,
) (*Variation, error) {
	var o Variation
	row := sctx.DB.QueryRow(context.Background(), `
  SELECT
    v.id, v.key, v.name, v.description, v.tags
  FROM
    workspace w, project p, flag f, variation v
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    f.key = $3 AND
    v.key = $4 AND
    p.workspace_id = w.id AND
    f.project_id = p.id AND
    v.flag_id = f.id
  `, workspaceKey, projectKey, flagKey, variationKey)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		return &o, fmt.Errorf("unable to find variation with key %s", variationKey)
	}

	return &o, nil
}
