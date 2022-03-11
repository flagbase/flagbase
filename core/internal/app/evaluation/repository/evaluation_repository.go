package repository

// import (
// 	"context"
// 	evaluationmodel "core/internal/app/evaluation/model"
// 	"core/internal/pkg/srvenv"

// 	"github.com/jackc/pgx/v4/pgxpool"
// )

// type Repo struct {
// 	DB *pgxpool.Pool
// }

// func NewRepo(senv *srvenv.Env) *Repo {
// 	return &Repo{
// 		DB: senv.DB,
// 	}
// }

// func (r *Repo) ListRawFlagsetViaSDKKey(
// 	ctx context.Context,
// 	a evaluationmodel.RootArgs,
// ) ([]*flagmodel.Flag, error) {
// 	var o []*flagmodel.Flag
// 	sqlStatement := `
//   SELECT
// 	t.id AS id,
// 	f.key AS flagKey,
// 	t.enabled = false AS useFallthrough,
// 	(SELECT ARRAY(
// 		SELECT TO_JSON(fv)
// 		FROM (
//     SELECT
//       v.id AS id,
//       v.key AS variationKey,
//       COALESCE(tfv.weight, 0) AS weight
//     FROM variation v
//     LEFT JOIN targeting_fallthrough_variation tfv
//       ON tfv.variation_id = v.id
//       AND tfv.targeting_id = t.id
//     WHERE v.flag_id = f.id) fv
// 	)) AS fallthroughVariations,
//   -- targeting_rules for traits
// 	(
// 	SELECT ARRAY(
// 		SELECT TO_JSONB(ttrs)
// 		FROM (
// 	    SELECT
// 	      tr.id AS id,
// 	      tr.type AS ruleType,
// 	      tr.trait_key AS traitKey,
// 	      tr.trait_value AS traitValue,
// 	      tr.operator AS operator,
// 	      tr.negate AS negate,
// 	      (SELECT ARRAY(
// 	        SELECT TO_JSON(trvs)
// 	        FROM (
// 	        SELECT
// 	          v2.id AS id,
// 	          v2.key AS variationKey,
// 	          COALESCE(trv.weight, 0) AS weight
// 	        FROM variation v2
// 	        LEFT JOIN targeting_rule_variation trv
// 	          ON trv.variation_id = v2.id
// 	          AND trv.targeting_rule_id = tr.id
// 	        WHERE v2.flag_id = f.id
// 	      ) trvs)) AS ruleVariations
// 	    FROM targeting_rule tr
// 	    WHERE tr.targeting_id = t.id
// 	    	AND tr.type = 'trait') ttrs
// 		)

// 		-- TODO EXPAND SEGMENT RULE VARIATIONS
// 		union all
// 		select
// 	      sr.id AS id,
// 	      sr.type AS ruleType,
// 	      sr.trait_key AS traitKey,
// 	      sr.trait_value AS traitValue,
// 	      sr.operator AS operator,
// 	      sr.negate AS negate,
// 	      (SELECT ARRAY(
// 	        SELECT TO_JSON(srvs)
// 	        FROM (
// 	        SELECT
// 	          v2.id AS id,
// 	          v2.key AS variationKey,
// 	          COALESCE(trv.weight, 0) AS weight
// 	        FROM variation v3
// 	        LEFT JOIN se trv
// 	          ON trv.variation_id = v2.id
// 	          AND trv.targeting_rule_id = tr.id
// 	        WHERE v2.flag_id = f.id
// 	      ) srvs)) AS ruleVariations
// 		from targeting_rule tr2
// 		left join segment s
// 			on s.id = tr2.segment_id
// 		left join segment_rule sr
// 			on sr.segment_id = s.id
// 			and sr.environment_id = e.id
// 		where tr2.type = "segment"

// 		) AS rules
// FROM workspace w
// LEFT JOIN project p
// 	ON p.workspace_id = w.id
// LEFT JOIN environment e
// 	ON e.project_id = p.id
// LEFT JOIN flag f
// 	ON f.project_id = p.id
// LEFT JOIN targeting t
// 	ON t.environment_id = e.id
// 	AND t.flag_id = f.id
// WHERE	w.key = 'testing-workspace'
// 	AND p.key = 'testing-project'
// 	AND e.key = 'production'`
// 	rows, err := r.DB.Query(
// 		ctx,
// 		sqlStatement,
// 		a.WorkspaceKey,
// 		a.ProjectKey,
// 	)
// 	if err != nil {
// 		return nil, err
// 	}
// 	for rows.Next() {
// 		var _o flagmodel.Flag
// 		if err = rows.Scan(
// 			&_o.ID,
// 			&_o.Key,
// 			&_o.Name,
// 			&_o.Description,
// 			&_o.Tags,
// 		); err != nil {
// 			return nil, err
// 		}
// 		o = append(o, &_o)
// 	}
// 	return o, nil
// }
