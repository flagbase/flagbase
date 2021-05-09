package segmentrule

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"
)

func listResource(
	ctx context.Context,
	senv *srvenv.Env,
	a RootArgs,
) (*[]SegmentRule, error) {
	var o []SegmentRule
	sqlStatement := `
SELECT
  sr.id,
  sr.key,
  sr.trait_key,
  sr.trait_value,
  sr.operator,
  sr.negate
FROM segment_rule sr
LEFT JOIN segment s
  ON s.id = sr.segment_id
LEFT JOIN environment e
  ON e.id = sr.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND s.key = $4`
	rows, err := senv.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.SegmentKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o SegmentRule
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.TraitKey,
			&_o.TraitValue,
			&_o.Operator,
			&_o.Negate,
		); err != nil {
			return nil, err
		}
		o = append(o, _o)
	}
	return &o, nil
}

func createResource(
	ctx context.Context,
	senv *srvenv.Env,
	i SegmentRule,
	a RootArgs,
) (*SegmentRule, error) {
	var o SegmentRule
	sqlStatement := `
INSERT INTO
  segment_rule(
    key,
    trait_key,
    trait_value,
    operator,
    negate,
    segment_id,
    environment_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    (
      SELECT s.id
      FROM segment s
      LEFT JOIN project p
        ON p.id = s.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $6
        AND p.key = $7
        AND s.key = $9
    ),
    (
      SELECT e.id
      FROM environment e
      LEFT JOIN project p
        ON p.id = e.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $6
        AND p.key = $7
        AND e.key = $8
    )
  )
RETURNING
  id,
  key,
  trait_key,
  trait_value,
  operator,
  negate;`
	err := dbutil.ParseError(
		rsc.SegmentRule.String(),
		ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
			SegmentKey:     a.SegmentKey,
			SegmentRuleKey: i.Key,
		},
		senv.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.TraitKey,
			i.TraitValue,
			i.Operator,
			i.Negate,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.SegmentKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.TraitKey,
			&o.TraitValue,
			&o.Operator,
			&o.Negate,
		),
	)
	return &o, err
}

func getResource(
	ctx context.Context,
	senv *srvenv.Env,
	a ResourceArgs,
) (*SegmentRule, error) {
	var o SegmentRule
	sqlStatement := `
SELECT
  sr.id,
  sr.key,
  sr.trait_key,
  sr.trait_value,
  sr.operator,
  sr.negate
FROM segment_rule sr
LEFT JOIN segment s
  ON s.id = sr.segment_id
LEFT JOIN environment e
  ON e.id = sr.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND s.key = $4
  AND sr.key = $5`
	err := dbutil.ParseError(
		rsc.SegmentRule.String(),
		a,
		senv.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.SegmentKey,
			a.SegmentRuleKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.TraitKey,
			&o.TraitValue,
			&o.Operator,
			&o.Negate,
		),
	)
	return &o, err
}

func updateResource(
	ctx context.Context,
	senv *srvenv.Env,
	i SegmentRule,
	a ResourceArgs,
) (*SegmentRule, error) {
	sqlStatement := `
UPDATE segment_rule
SET
  key = $2,
  trait_key = $3,
  trait_value = $4,
  operator = $5,
  negate = $6
WHERE id = $1`
	if _, err := senv.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Key,
		i.TraitKey,
		i.TraitValue,
		i.Operator,
		i.Negate,
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.SegmentRule.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func deleteResource(
	ctx context.Context,
	senv *srvenv.Env,
	a ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM segment_rule
WHERE key = $5
  AND segment_id = (
    SELECT s.id
    FROM segment s
    LEFT JOIN project p
      ON p.id = s.project_id
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $1
      AND p.key = $2
      AND s.key = $4
  )
  AND environment_id = (
    SELECT e.id
    FROM environment e
    LEFT JOIN project p
      ON p.id = e.project_id
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $1
      AND p.key = $2
      AND e.key = $3
  )`
	if _, err := senv.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.SegmentKey,
		a.SegmentRuleKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.SegmentRule.String(),
			a,
			err,
		)
	}
	return nil
}
