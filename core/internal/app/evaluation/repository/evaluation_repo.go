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
	select 
	f.id as id,
	f.key as flag_key,
	(
		select not t.enabled
		from targeting t 
		where 1=1
			and t.flag_id = f.id 
			and t.environment_id = e.id
	) as use_fallthrough,
	(
		select json_agg(
			json_build_object(
				'id', tfv.variation_id,
				'variationKey', v.key,
				'weight', tfv.weight
			)
		)
		from targeting_fallthrough_variation tfv 
		left join targeting t on t.id = tfv.targeting_id
		left join variation v on v.id = tfv.variation_id 
		where 1=1
			and t.flag_id = f.id 
			and t.environment_id = e.id
	) as fallthrough_variations,
	(
		select json_agg(
			json_build_object(
				'id', tr.id,
				'ruleType', tr.type,
				'traitKey', tr.trait_key,
				'traitValue', tr.trait_value,
				'operator', tr.operator,
				'negate', tr.negate,
				'ruleVariations', (
					select json_agg(
						json_build_object(
							'id', trv.variation_id,
							'variationKey', v2.key,
							'weight', trv.weight
						)
					)
					from targeting_rule_variation trv 
					left join variation v2 on v2.id = trv.variation_id 
					where trv.targeting_rule_id = tr.id
				)
			)
		)
		from targeting_rule tr 
		left join targeting t on t.id = tr.targeting_id
		where 1=1
			and t.flag_id = f.id 
			and t.environment_id = e.id
	) as rules
from flag f 
left join project p on p.id = f.project_id
left join workspace w on w.id = p.workspace_id
left join environment e on e.project_id  = p.id 
where 1=1
	and w.key = $1
	and p.key = $2
	and e.key = $3`
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
