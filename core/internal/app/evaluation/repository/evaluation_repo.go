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
SELECT 
	f.id AS id,
	f.key AS flag_key,
	(
		SELECT not t.enabled
		FROM targeting t 
		WHERE 1=1
			AND t.flag_id = f.id 
			AND t.environment_id = e.id
	) AS use_fallthrough,
	(
		SELECT json_agg(
			json_build_object(
				'id', tfv.variation_id,
				'variationKey', v.key,
				'weight', tfv.weight
			)
		)
		FROM targeting_fallthrough_variation tfv 
		LEFT JOIN targeting t ON t.id = tfv.targeting_id
		LEFT JOIN variation v ON v.id = tfv.variation_id 
		WHERE 1=1
			AND t.flag_id = f.id 
			AND t.environment_id = e.id
	) AS fallthrough_variations,
	(
		SELECT json_agg(
			json_build_object(
				'id', tr.id,
				'ruleType', tr.type,
				'traitKey', tr.trait_key,
				'traitValue', tr.trait_value,
				'operator', tr.operator,
				'negate', tr.negate,
				'ruleVariations', (
					SELECT json_agg(
						json_build_object(
							'id', trv.variation_id,
							'variationKey', v2.key,
							'weight', trv.weight
						)
					)
					FROM targeting_rule_variation trv 
					LEFT JOIN variation v2 ON v2.id = trv.variation_id 
					WHERE trv.targeting_rule_id = tr.id
				)
			)
		)
		FROM targeting_rule tr 
		LEFT JOIN targeting t ON t.id = tr.targeting_id
		WHERE 1=1
			AND t.flag_id = f.id 
			AND t.environment_id = e.id
	) AS rules
FROM flag f 
LEFT JOIN project p ON p.id = f.project_id
LEFT JOIN workspace w ON w.id = p.workspace_id
LEFT JOIN environment e ON e.project_id  = p.id 
WHERE 1=1
	AND w.key = $1
	AND p.key = $2
	AND e.key = $3`
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
