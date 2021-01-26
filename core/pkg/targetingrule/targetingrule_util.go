package targetingrule

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
	ruleKey rsc.Key,
) (*TargetingRule, error) {
	var o TargetingRule
	row := db.Pool.QueryRow(context.Background(), `
    SELECT
      tr.id,
      tr.key,
      tr.type,
      tr.matches,
      i.key,
      s.key,
      v.key
    FROM
      workspace w,
      project p,
      environment e,
      flag f,
      variation v,
      segment s,
      identity i,
      targeting t,
      targeting_rule tr
    WHERE
      w.key = $1 AND
      p.key = $2 AND
      f.key = $3 AND
      e.key = $4 AND
      tr.key = $5 AND
      p.workspace_id = w.id AND
      f.project_id = p.id AND
      e.project_id = p.id AND
      v.flag_id = f.id AND
      s.project_id = p.id AND
      i.environment_id = e.id AND
      t.flag_id = f.id AND
      t.environment = e.id AND
      tr.targeting_id = t.id
    `,
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
		ruleKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Type,
		&o.Matches,
		&o.IdentityKey,
		&o.SegmentKey,
		&o.VariationKey,
	); err != nil {
		return &o, fmt.Errorf(
			"unable to find targeting_rule object given"+
				"workspaceKey = %s, projectKey = %s, flagKey = %s, "+
				"environmentKey = %s, targetingRuleKey = %s",
			workspaceKey,
			projectKey,
			flagKey,
			environmentKey,
			ruleKey,
		)
	}

	return &o, nil
}
