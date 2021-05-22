package repository

import (
	"context"
	flagmodel "core/internal/app/flag/model"
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
	a flagmodel.RootArgs,
) ([]*flagmodel.Flag, error) {
	var o []*flagmodel.Flag
	sqlStatement := `
SELECT
  f.id,
  f.key,
  f.name,
  f.description,
  f.tags
FROM flag f
LEFT JOIN project p
  ON p.id = f.project_id
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
		var _o flagmodel.Flag
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
	i flagmodel.Flag,
	a flagmodel.RootArgs,
) (*flagmodel.Flag, error) {
	var o flagmodel.Flag
	sqlStatement := `
INSERT INTO
  flag(
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
		rsc.Flag.String(),
		flagmodel.ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			FlagKey:      i.Key,
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
	a flagmodel.ResourceArgs,
) (*flagmodel.Flag, error) {
	var o flagmodel.Flag
	sqlStatement := `
SELECT
  f.id,
  f.key,
  f.name,
  f.description,
  f.tags
FROM flag f
LEFT JOIN project p
  ON p.id = f.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND f.key = $3`
	err := dbutil.ParseError(
		rsc.Flag.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.FlagKey,
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
	i flagmodel.Flag,
	a flagmodel.ResourceArgs,
) (*flagmodel.Flag, error) {
	sqlStatement := `
UPDATE
  flag
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
			rsc.Flag.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a flagmodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM flag
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
		a.FlagKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Flag.String(),
			a,
			err,
		)
	}
	return nil
}
