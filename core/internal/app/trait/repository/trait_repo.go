package repo

import (
	"context"
	traitmodel "core/internal/app/trait/model"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"

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
	a traitmodel.RootArgs,
) ([]*traitmodel.Trait, error) {
	var o []*traitmodel.Trait
	sqlStatement := `
SELECT
  t.id,
  t.key,
  t.is_identifier
FROM trait t
LEFT JOIN environment e
  ON e.id = t.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
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
		var _o traitmodel.Trait
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.IsIdentifier,
		); err != nil {
			return nil, err
		}
		o = append(o, &_o)
	}
	return o, nil
}

func (r *Repo) Create(
	ctx context.Context,
	i traitmodel.Trait,
	a traitmodel.RootArgs,
) (*traitmodel.Trait, error) {
	var o traitmodel.Trait
	sqlStatement := `
INSERT INTO
  trait(
    key,
    is_identifier,
    environment_id
  )
VALUES
  (
    $1,
    $2,
    (
      SELECT e.id
      FROM environment e
      LEFT JOIN project p
        ON p.id = e.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $3
        AND p.key = $4
        AND e.key = $5
    )
  )
RETURNING
  id,
  key,
  is_identifier;`
	err := dbutil.ParseError(
		rsc.Trait.String(),
		traitmodel.ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
			TraitKey:       i.Key,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.IsIdentifier,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.IsIdentifier,
		),
	)
	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	a traitmodel.ResourceArgs,
) (*traitmodel.Trait, error) {
	var o traitmodel.Trait
	sqlStatement := `
SELECT
  t.id,
  t.key,
  t.is_identifier
FROM trait t
LEFT JOIN environment e
  ON e.id = t.environment_id
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3
  AND t.key = $4`
	err := dbutil.ParseError(
		rsc.Trait.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
			a.TraitKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.IsIdentifier,
		),
	)
	return &o, err
}

func (r *Repo) Update(
	ctx context.Context,
	i traitmodel.Trait,
	a traitmodel.ResourceArgs,
) (*traitmodel.Trait, error) {
	sqlStatement := `
UPDATE trait
SET
  key = $2,
  is_identifier = $3
WHERE id = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		i.ID,
		i.Key,
		i.IsIdentifier,
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Trait.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a traitmodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM trait
WHERE key = $4
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
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
		a.TraitKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Trait.String(),
			a,
			err,
		)
	}
	return nil
}
