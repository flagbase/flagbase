package repository

import (
	"context"
	evaluationmodel "core/internal/app/evaluation/model"
	"core/internal/pkg/srvenv"
	"core/pkg/model"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Repo struct {
	DB *pgxpool.Pool
}

func NewRepo(senv *srvenv.Env) *Repo {
	return &Repo{
		DB: senv.DB,
	}
}

func (r *Repo) List(
	ctx context.Context,
	a evaluationmodel.RootArgs,
) ([]*model.Flag, error) {
	var o []*model.Flag
	sqlStatement := `
WITH flags AS (
	SELECT f.id, f.key AS flag_key
	FROM flag f
	JOIN project p ON f.project_id = p.id
	JOIN workspace w ON p.workspace_id = w.id
	JOIN environment e ON p.id = e.project_id
	WHERE w.key = $1 AND p.key = $2 AND e.key = $3
),
targetings AS (
	SELECT t.flag_id, t.enabled AS use_fallthrough, t.id AS targeting_id
	FROM targeting t
	JOIN environment e ON t.environment_id = e.id
	JOIN flags f ON t.flag_id = f.id
),
fallthrough_variations AS (
	SELECT tfv.targeting_id, v.key AS variation_key, tfv.weight
	FROM targeting_fallthrough_variation tfv
	JOIN variation v ON tfv.variation_id = v.id
),
rules AS (
	SELECT tr.id, tr.targeting_id, tr.key AS rule_key, tr.type AS rule_type, tr.trait_key, tr.trait_value, tr.operator, tr.negate
	FROM targeting_rule tr
	JOIN targetings t ON tr.targeting_id = t.targeting_id
),
rule_variations AS (
	SELECT trv.targeting_rule_id, v.key AS variation_key, trv.weight
	FROM targeting_rule_variation trv
	JOIN variation v ON trv.variation_id = v.id
),
rule_variations_aggregated AS (
	SELECT
		r.id AS rule_id,
		json_agg(json_build_object('id', rv.variation_key, 'variationKey', rv.variation_key, 'weight', rv.weight)) AS rule_variations
	FROM rules r
	LEFT JOIN rule_variations rv ON r.id = rv.targeting_rule_id
	GROUP BY r.id
)
SELECT
	f.id,
	f.flag_key,
	t.use_fallthrough,
	json_agg(json_build_object('id', fv.variation_key, 'variationKey', fv.variation_key, 'weight', fv.weight)) FILTER (WHERE fv.variation_key IS NOT NULL) AS fallthrough_variations,
	json_agg(json_build_object('id', r.rule_key, 'ruleType', r.rule_type, 'traitKey', r.trait_key, 'traitValue', r.trait_value, 'operator', r.operator, 'negate', r.negate, 'ruleVariations', rva.rule_variations)) FILTER (WHERE r.rule_key IS NOT NULL) AS rules
FROM flags f
JOIN targetings t ON f.id = t.flag_id
LEFT JOIN fallthrough_variations fv ON t.targeting_id = fv.targeting_id
LEFT JOIN rules r ON t.targeting_id = r.targeting_id
LEFT JOIN rule_variations_aggregated rva ON r.id = rva.rule_id
GROUP BY f.id, f.flag_key, t.use_fallthrough`
	rows, err := r.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var _o model.Flag
		if err = rows.Scan(
			&_o.ID,
			&_o.FlagKey,
			&_o.UseFallthrough,
			&_o.FallthroughVariations,
			&_o.Rules,
		); err != nil {
			return nil, err
		}
		o = append(o, &_o)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return o, nil
}
