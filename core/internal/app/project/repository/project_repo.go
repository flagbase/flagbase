package repository

import (
	"context"
	projectmodel "core/internal/app/project/model"
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
	a projectmodel.RootArgs,
) ([]*projectmodel.Project, error) {
	var o []*projectmodel.Project
	sqlStatement := `
SELECT
  p.id,
  p.key,
  p.name,
  p.description,
  p.tags
FROM project p
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1`
	rows, err := r.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o projectmodel.Project
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
	i projectmodel.Project,
	a projectmodel.RootArgs,
) (*projectmodel.Project, error) {
	var o projectmodel.Project
	sqlStatement := `
INSERT INTO
  project(
    key,
    name,
    description,
    tags,
    workspace_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    (
      SELECT id
      FROM workspace
      WHERE key = $5
    )
  )
RETURNING
  id,
  key,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.Project.String(),
		projectmodel.ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   i.Key,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			a.WorkspaceKey,
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
	a projectmodel.ResourceArgs,
) (*projectmodel.Project, error) {
	var o projectmodel.Project
	sqlStatement := `
SELECT
  p.id,
  p.key,
  p.name,
  p.description,
  p.tags
FROM project p
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2`
	err := dbutil.ParseError(
		rsc.Project.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
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

func (r *Repo) Update(
	ctx context.Context,
	i projectmodel.Project,
	a projectmodel.ResourceArgs,
) (*projectmodel.Project, error) {
	sqlStatement := `
UPDATE project
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
			rsc.Project.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a projectmodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM project
WHERE key = $2
  AND workspace_id = (
    SELECT id
    FROM workspace
    WHERE key = $1
  )`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Project.String(),
			a,
			err,
		)
	}
	return nil
}
