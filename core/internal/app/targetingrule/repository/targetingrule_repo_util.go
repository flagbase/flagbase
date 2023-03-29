package repository

import (
	"context"
	targetingrulemodel "core/internal/app/targetingrule/model"
	rsc "core/internal/pkg/resource"
	"core/pkg/dbutil"
)

// TODO: targetingrulerepo should use this instead
func (r *Repo) CreateRuleVariations(
	ctx context.Context,
	i targetingrulemodel.TargetingRule,
	a targetingrulemodel.RootArgs,
) (*targetingrulemodel.TargetingRule, error) {
	var err error
	for _, rv := range i.RuleVariations {
		sqlStatement := `
INSERT INTO
  targeting_rule_variation(
    weight,
    targeting_rule_id,
    variation_id
  )
VALUES
  (
    $1,
    $2,
    (
      SELECT v.id
      FROM variation v
      LEFT JOIN flag f
        ON f.id = v.flag_id
      LEFT JOIN project p
        ON p.id = f.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $3
        AND p.key = $4
        AND f.key = $5
        AND v.key = $6
    )
  )
ON CONFLICT (targeting_rule_id, variation_id) DO NOTHING
RETURNING
  weight`
		err = dbutil.ParseError(
			rsc.FallthroughVariation.String(),
			a,
			r.DB.QueryRow(
				ctx,
				sqlStatement,
				rv.Weight,
				i.ID,
				a.WorkspaceKey,
				a.ProjectKey,
				a.FlagKey,
				rv.VariationKey,
			).Scan(&rv.Weight),
		)
		i.RuleVariations = append(i.RuleVariations, rv)
	}

	return &i, err
}
