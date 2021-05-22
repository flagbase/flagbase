package repository

import (
	"context"
	environmentmodel "core/internal/app/environment/model"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"

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
	a environmentmodel.RootArgs,
) ([]*environmentmodel.Environment, error) {
	var o []*environmentmodel.Environment
	sqlStatement := `
SELECT
  e.id,
  e.key,
  e.name,
  e.description,
  e.tags
FROM environment e
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2`
	rows, err := r.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o environmentmodel.Environment
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.Name,
			&_o.Description,
			&_o.Tags,
		); err != nil {
			return nil, err
		}
		o = append(o, &_o)
	}
	return o, nil
}

func (r *Repo) Create(
	ctx context.Context,
	i environmentmodel.Environment,
	a environmentmodel.RootArgs,
) (*environmentmodel.Environment, error) {
	var o environmentmodel.Environment
	sqlStatement := `
INSERT INTO
  environment(
    key,
    name,
    description,
    tags,
    project_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    (
      SELECT p.id
      FROM project p
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $5
        AND p.key = $6
    )
  )
RETURNING
  id,
  key,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.Environment.String(),
		environmentmodel.ResourceArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: i.Key,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			a.WorkspaceKey,
			a.ProjectKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.Name,
			&o.Description,
			&o.Tags,
		),
	)
	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	a environmentmodel.ResourceArgs,
) (*environmentmodel.Environment, error) {
	var o environmentmodel.Environment
	sqlStatement := `
SELECT
  e.id,
  e.key,
  e.name,
  e.description,
  e.tags
FROM environment e
LEFT JOIN project p
  ON p.id = e.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND e.key = $3`
	err := dbutil.ParseError(
		rsc.Environment.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.EnvironmentKey,
		).Scan(
			&o.ID,
			&o.Key,
			&o.Name,
			&o.Description,
			&o.Tags,
		),
	)
	return &o, err
}

func (r *Repo) Update(
	ctx context.Context,
	i environmentmodel.Environment,
	a environmentmodel.ResourceArgs,
) (*environmentmodel.Environment, error) {
	sqlStatement := `
UPDATE environment
SET
  key = $2,
  name = $3,
  description = $4,
  tags = $5
WHERE id = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		i.ID,
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Environment.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a environmentmodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM environment
WHERE key = $3
  AND project_id = (
    SELECT p.id
    FROM project p
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $1
      AND p.key = $2
  )`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.EnvironmentKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Environment.String(),
			a,
			err,
		)
	}
	return nil
}
