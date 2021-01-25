package segmentrule

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getResource(
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	segmentKey rsc.Key,
	segmentRuleKey rsc.Key,
) (*SegmentRule, error) {
	var o SegmentRule
	row := db.Pool.QueryRow(context.Background(), `
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
      segment_rule sr
    WHERE
      w.key = $1 AND
      p.key = $2 AND
      s.key = $3 AND
      sr.key = $4 AND
      p.workspace_id = w.id AND
      s.project_id = p.id AND
      sr.segment_id = s.id
    `,
		workspaceKey,
		projectKey,
		segmentKey,
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
