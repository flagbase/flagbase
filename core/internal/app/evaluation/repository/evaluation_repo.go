package repository

import (
	"context"
	evaluationmodel "core/internal/app/evaluation/model"
	"core/internal/pkg/srvenv"
	coremodel "core/pkg/model"

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

func (r *Repo) GetFlagsetViaParams(
	ctx context.Context,
	a evaluationmodel.RootArgs,
) (coremodel.Flagset, error) {
	var o coremodel.Flagset
	sqlStatement := `
SELECT
	t.id AS id,
	f.key AS flag_key,
	t.enabled = false AS use_fallthrough,
  (SELECT ARRAY(
		SELECT TO_JSON(fv)
		FROM (
    SELECT
      v.id AS id,
      v.key AS variationKey,
      COALESCE(tfv.weight, 0) AS weight
    FROM variation v
    LEFT JOIN targeting_fallthrough_variation tfv
      ON tfv.variation_id = v.id
      AND tfv.targeting_id = t.id
    WHERE v.flag_id = f.id) fv
	)) AS fallthroughVariations
FROM workspace w
LEFT JOIN project p
	ON p.workspace_id = w.id
LEFT JOIN environment e
	ON e.project_id = p.id
LEFT JOIN flag f
	ON f.project_id = p.id
LEFT JOIN targeting t
	ON t.environment_id = e.id
	AND t.flag_id = f.id
WHERE	w.key = $1
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
	for rows.Next() {
		var _o coremodel.Flag
		var v []interface{}
		if err = rows.Scan(
			&_o.ID,
			&_o.FlagKey,
			&_o.UseFallthrough,
			&v,
		); err != nil {
			return nil, err
		}
		o = append(o, &_o)
	}
	return o, nil
}
