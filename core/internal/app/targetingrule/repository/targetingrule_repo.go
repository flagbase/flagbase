package repository

import (
	"context"
	targetingrulemodel "core/internal/app/targetingrule/model"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"
	"core/pkg/flagset"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lib/pq"
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
	a targetingrulemodel.RootArgs,
) (*[]targetingrulemodel.TargetingRule, error) {
	var o []targetingrulemodel.TargetingRule
	sqlStatement := `
SELECT
  tr.id,
  tr.key,
  tr.type,
  tr.name,
  tr.description,
  tr.tags,
  tr.trait_key,
  tr.trait_value,
  tr.operator,
  tr.negate,
  COALESCE(s.key, '') as segmentKey,
  COALESCE(i.key, '') as identityKey
FROM targeting_rule tr
LEFT JOIN targeting t
  ON t.id = tr.targeting_id
LEFT JOIN segment s
  ON s.id = tr.segment_id
LEFT JOIN identity i
  ON i.id = tr.segment_id
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
	rows, err := r.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.FlagKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o targetingrulemodel.TargetingRule
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.Type,
			&_o.Name,
			&_o.Description,
			&_o.Tags,
			&_o.TraitKey,
			&_o.TraitValue,
			&_o.Operator,
			&_o.Negate,
			&_o.SegmentKey,
			&_o.IdentityKey,
		); err != nil {
			return nil, err
		}

		sqlStatement := `
SELECT
  trv.weight,
  v.key
FROM targeting_rule_variation trv
LEFT JOIN targeting_rule tr
  ON tr.id = trv.targeting_rule_id
LEFT JOIN variation v
  ON v.id = trv.variation_id
WHERE tr.id = $1`
		_rows, err := r.DB.Query(
			ctx,
			sqlStatement,
			_o.ID.String(),
		)
		if err != nil {
			return &o, err
		}
		for _rows.Next() {
			var _v flagset.Variation
			if err = _rows.Scan(
				&_v.Weight,
				&_v.VariationKey,
			); err != nil {
				return nil, err
			}
			_o.RuleVariations = append(_o.RuleVariations, _v)
		}

		o = append(o, _o)
	}
	return &o, nil
}

func (r *Repo) Create(
	ctx context.Context,
	i targetingrulemodel.TargetingRule,
	a targetingrulemodel.RootArgs,
) (*targetingrulemodel.TargetingRule, error) {
	var o targetingrulemodel.TargetingRule
	sqlStatement := `
INSERT INTO
  targeting_rule(
    key,
    type,
    name,
    description,
    tags,
    trait_key,
    trait_value,
    operator,
    negate,
    identity_id,
    segment_id,
    targeting_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    (
      SELECT COALESCE(i.id, NULL)
      FROM identity i
      LEFT JOIN environment e
        ON e.id = i.environment_id
      LEFT JOIN project p
        ON p.id = e.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $12
        AND p.key = $13
        AND e.key = $14
        AND i.key = $10
    ),
    (
      SELECT COALESCE(s.id, NULL)
      FROM segment s
      LEFT JOIN project p
        ON p.id = s.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $12
        AND p.key = $13
        AND s.key = $11
    ),
    (
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
      WHERE w.key = $12
        AND p.key = $13
        AND e.key = $14
        AND f.key = $15
    )
  )
RETURNING
  id,
  key,
  type,
  name,
  description,
  tags,
  trait_key,
  trait_value,
  operator,
  negate;`
	if err := dbutil.ParseError(
		rsc.TargetingRule.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Type,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			i.TraitKey,
			i.TraitValue,
			i.Operator,
			i.Negate,
			i.IdentityKey.String(),
			i.SegmentKey.String(),
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.FlagKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.Type,
			&o.Name,
			&o.Description,
			&o.Tags,
			&o.TraitKey,
			&o.TraitValue,
			&o.Operator,
			&o.Negate,
		),
	); err != nil {
		return &o, err
	}
	o.SegmentKey = i.SegmentKey
	o.IdentityKey = i.IdentityKey

	var err error
	for _, f := range i.RuleVariations {
		sqlStatement = `
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
RETURNING
  weight`
		err = dbutil.ParseError(
			rsc.RuleVariation.String(),
			a,
			r.DB.QueryRow(
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
		o.RuleVariations = append(o.RuleVariations, f)
	}

	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	a targetingrulemodel.ResourceArgs,
) (*targetingrulemodel.TargetingRule, error) {
	var o targetingrulemodel.TargetingRule
	sqlStatement := `
SELECT
  tr.id,
  tr.key,
  tr.type,
  tr.name,
  tr.description,
  tr.tags,
  tr.trait_key,
  tr.trait_value,
  tr.operator,
  tr.negate
FROM targeting_rule tr
LEFT JOIN targeting t
  ON t.id = tr.targeting_id
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
  AND f.key = $4
  AND tr.key = $5`
	err := dbutil.ParseError(
		rsc.TargetingRule.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.FlagKey,
			a.RuleKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.Type,
			&o.Name,
			&o.Description,
			&o.Tags,
			&o.TraitKey,
			&o.TraitValue,
			&o.Operator,
			&o.Negate,
		),
	)
	if err != nil {
		return &o, err
	}

	sqlStatement = `
SELECT
  trv.weight,
  v.key
FROM targeting_rule_variation trv
LEFT JOIN targeting_rule tr
  ON tr.id = trv.targeting_rule_id
LEFT JOIN targeting t
  ON t.id = tr.targeting_id
LEFT JOIN flag f
  ON f.id = t.flag_id
LEFT JOIN variation v
  ON v.flag_id = f.id
  AND v.id = trv.variation_id
LEFT JOIN project p
  ON p.id = f.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND f.key = $3
  AND tr.id = $4`
	rows, err := r.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.FlagKey,
		o.ID.String(),
	)
	if err != nil {
		return &o, err
	}
	for rows.Next() {
		var _o flagset.Variation
		if err = rows.Scan(
			&_o.Weight,
			&_o.VariationKey,
		); err != nil {
			return nil, err
		}
		o.RuleVariations = append(o.RuleVariations, _o)
	}

	return &o, err
}

func (r *Repo) Update(
	ctx context.Context,
	i targetingrulemodel.TargetingRule,
	a targetingrulemodel.ResourceArgs,
) (*targetingrulemodel.TargetingRule, error) {
	sqlStatement := `
UPDATE targeting_rule
SET
  key = $2,
  type = $3,
  name = $4,
  description = $5,
  tags = $6,
  trait_key = $7,
  trait_value = $8,
  operator = $9,
  negate = $10,
  identity_id = (
    SELECT COALESCE(i.id, NULL)
    FROM identity i
    LEFT JOIN environment e
      ON e.id = i.environment_id
    LEFT JOIN project p
      ON p.id = e.project_id
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $13
      AND p.key = $14
      AND e.key = $15
      AND i.key = $11
  ),
  segment_id = (
    SELECT COALESCE(s.id, NULL)
    FROM segment s
    LEFT JOIN project p
      ON p.id = s.project_id
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $13
      AND p.key = $14
      AND s.key = $12
  )
WHERE id = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Key,
		i.Type,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
		i.TraitKey,
		i.TraitValue,
		i.Operator,
		i.Negate,
		i.IdentityKey.String(),
		i.SegmentKey.String(),
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.TargetingRule.String(),
			a,
			err,
		)
	}

	for _, f := range i.RuleVariations {
		sqlStatement := `
UPDATE targeting_rule_variation
SET
  weight = $2
WHERE targeting_rule_id = $1
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
		if _, err := r.DB.Exec(
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
				rsc.RuleVariation.String(),
				a,
				err,
			)
		}
	}

	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a targetingrulemodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM targeting_rule_variation
WHERE targeting_rule_id = (
  SELECT tr.id
  FROM targeting_rule tr
  LEFT JOIN targeting t
    ON t.id = tr.targeting_id
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
    AND f.key = $4
    AND tr.key = $5
)`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.FlagKey,
		a.RuleKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.RuleVariation.String(),
			a,
			err,
		)
	}

	sqlStatement = `
DELETE FROM targeting_rule
WHERE id = (
  SELECT tr.id
  FROM targeting_rule tr
  LEFT JOIN targeting t
    ON t.id = tr.targeting_id
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
    AND f.key = $4
    AND tr.key = $5
)`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.FlagKey,
		a.RuleKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.TargetingRule.String(),
			a,
			err,
		)
	}

	return nil
}
