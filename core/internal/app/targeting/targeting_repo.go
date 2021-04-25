package targeting

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/dbutil"
	"fmt"
)

func createResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Targeting,
	a RootArgs,
) (*Targeting, error) {
	var o Targeting
	sqlStatement := `
INSERT INTO
  targeting(
    enabled,
    flag_id,
    environment_id
  )
VALUES
  (
    $1,
    (
      SELECT f.id
      FROM flag f
      LEFT JOIN project p
        ON p.id = f.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $2
        AND p.key = $3
        AND f.key = $5
    ),
    (
      SELECT e.id
      FROM environment e
      LEFT JOIN project p
        ON p.id = e.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $2
        AND p.key = $3
        AND e.key = $4
    )
  )
RETURNING
  id,
  enabled;`
	if err := dbutil.ParseError(
		rsc.Targeting.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Enabled,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.FlagKey,
		).Scan(
			&o.ID,
			&o.Enabled,
		),
	); err != nil {
		return &o, err
	}

	var err error
	for _, f := range i.FallthroughVariations {
		sqlStatement = `
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
RETURNING
  weight`
		err = dbutil.ParseError(
			rsc.FallthroughVariation.String(),
			a,
			sctx.DB.QueryRow(
				ctx,
				sqlStatement,
				f.Weight,
				o.ID.String(),
				a.WorkspaceKey,
				a.ProjectKey,
				a.FlagKey,
				f.VariationKey,
			).Scan(&f.Weight),
		)
		o.FallthroughVariations = append(o.FallthroughVariations, f)
	}

	return &o, err
}

func getResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) (*Targeting, error) {
	var o Targeting
	sqlStatement := `
SELECT
  t.id,
  t.enabled
FROM targeting t
LEFT JOIN flag f
  ON f.id = t.flag_id
LEFT JOIN environment e
  ON e.id = t.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  on w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND f.key = $4`
	err := dbutil.ParseError(
		rsc.Targeting.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.FlagKey,
		).Scan(
			&o.ID,
			&o.Enabled,
		),
	)
	if err != nil {
		return &o, err
	}

	sqlStatement = `
SELECT
  tfv.weight,
  v.key
FROM targeting_fallthrough_variation tfv
LEFT JOIN targeting t
  ON t.id = tfv.targeting_id
LEFT JOIN flag f
  ON f.id = t.flag_id
LEFT JOIN variation v
  ON v.id = tfv.variation_id
  AND v.flag_id = f.id
LEFT JOIN environment e
  ON e.id = t.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND f.key = $4`
	rows, err := sctx.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.FlagKey,
	)
	if err != nil {
		return &o, err
	}
	for rows.Next() {
		var _o FallthroughVariation
		if err = rows.Scan(
			&_o.Weight,
			&_o.VariationKey,
		); err != nil {
			return nil, err
		}
		o.FallthroughVariations = append(o.FallthroughVariations, _o)
	}

	return &o, err
}

func updateResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Targeting,
	a RootArgs,
) (*Targeting, error) {
	sqlStatement := `
UPDATE targeting
SET
  enabled = $2
WHERE id = $1`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Enabled,
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Targeting.String(),
			a,
			err,
		)
	}

	for _, f := range i.FallthroughVariations {
		sqlStatement := `
UPDATE targeting_fallthrough_variation
SET
  weight = $2
WHERE targeting_id = $1
  AND variation_id = (
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
  )`
		if _, err := sctx.DB.Exec(
			ctx,
			sqlStatement,
			i.ID.String(),
			f.Weight,
			a.WorkspaceKey,
			a.ProjectKey,
			a.FlagKey,
			f.VariationKey,
		); err != nil {
			return &i, dbutil.ParseError(
				rsc.Targeting.String(),
				a,
				err,
			)
		}
	}

	return &i, nil
}

func deleteResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) error {
	targetingIdSqlStatement := `
SELECT t.id
FROM targeting t
LEFT JOIN flag f
  ON f.id = t.flag_id
LEFT JOIN environment e
  ON e.id = t.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND f.key = $4`

	sqlStatement := fmt.Sprintf(`
DELETE FROM targeting_fallthrough_variation
WHERE targeting_id = (%s)`,
		targetingIdSqlStatement,
	)
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.FlagKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.FallthroughVariation.String(),
			a,
			err,
		)
	}

	sqlStatement = fmt.Sprintf(`
DELETE FROM targeting
WHERE id = (%s)`,
		targetingIdSqlStatement,
	)
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.FlagKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.FallthroughVariation.String(),
			a,
			err,
		)
	}

	return nil
}
