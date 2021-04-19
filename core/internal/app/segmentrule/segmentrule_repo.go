package segmentrule

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
	segmentKey rsc.Key,
	environmentKey rsc.Key,
	segmentRuleKey rsc.Key,
) (*SegmentRule, error) {
	var o SegmentRule
	row := sctx.DB.QueryRow(context.Background(), `
    SELECT
      sr.id,
      sr.key,
      sr.trait_key,
      sr.trait_value,
      sr.operator,
      sr.negate
    FROM
      workspace w,
      project p,
      segment s,
      environment e,
      segment_rule sr
    WHERE
      w.key = $1 AND
      p.key = $2 AND
      s.key = $3 AND
      e.key = $4 AND
      sr.key = $5 AND
      p.workspace_id = w.id AND
      s.project_id = p.id AND
      sr.environment_id = e.id AND
      sr.segment_id = s.id
    `,
		workspaceKey,
		projectKey,
		segmentKey,
		environmentKey,
		segmentRuleKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.TraitKey,
		&o.TraitValue,
		&o.Operator,
		&o.Negate,
	); err != nil {
		return &o, fmt.Errorf("unable to find segment_rule with key %s", segmentRuleKey)
	}

	return &o, nil
}
