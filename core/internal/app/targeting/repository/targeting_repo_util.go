package repository

import (
	"context"
	targetingmodel "core/internal/app/targeting/model"
	rsc "core/internal/pkg/resource"
	"core/pkg/dbutil"
)

// TODO: targetingrepo should use this instead
func (r *Repo) CreateFallthroughVariations(
	ctx context.Context,
	i targetingmodel.Targeting,
	a targetingmodel.RootArgs,
) (*targetingmodel.Targeting, error) {
	var err error
	for _, f := range i.FallthroughVariations {
		sqlStatement := `
INSERT INTO
  targeting_fallthrough_variation(
    weight,
    targeting_id,
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
ON CONFLICT (targeting_id, variation_id) DO NOTHING
RETURNING
  weight`
		err = dbutil.ParseError(
			rsc.FallthroughVariation.String(),
			a,
			r.DB.QueryRow(
				ctx,
				sqlStatement,
				f.Weight,
				i.ID,
				a.WorkspaceKey,
				a.ProjectKey,
				a.FlagKey,
				f.VariationKey,
			).Scan(&f.Weight),
		)
		i.FallthroughVariations = append(i.FallthroughVariations, f)
	}

	return &i, err
}
