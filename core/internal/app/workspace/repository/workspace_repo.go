package repository

import (
	"context"
	workspacemodel "core/internal/app/workspace/model"
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
	a workspacemodel.RootArgs,
) ([]*workspacemodel.Workspace, error) {
	var o []*workspacemodel.Workspace
	sqlStatement := `
SELECT
  id,
  key,
  name,
  description,
  tags
FROM workspace`
	rows, err := r.DB.Query(ctx, sqlStatement)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o workspacemodel.Workspace
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
	i workspacemodel.Workspace,
	a workspacemodel.RootArgs,
) (*workspacemodel.Workspace, error) {
	var o workspacemodel.Workspace
	sqlStatement := `
INSERT INTO
  workspace(
    key,
    name,
    description,
    tags
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4
  )
RETURNING
  id,
  key,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.Workspace.String(),
		workspacemodel.ResourceArgs{
			WorkspaceKey: i.Key,
		},
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
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
	a workspacemodel.ResourceArgs,
) (*workspacemodel.Workspace, error) {
	var o workspacemodel.Workspace
	sqlStatement := `
SELECT
  id,
  key,
  name,
  description,
  tags
FROM workspace
WHERE key = $1`
	err := dbutil.ParseError(
		rsc.Workspace.String(),
		a,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
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

func (r *Repo) Update(
	ctx context.Context,
	i workspacemodel.Workspace,
	a workspacemodel.ResourceArgs,
) (*workspacemodel.Workspace, error) {
	sqlStatement := `
UPDATE workspace
SET
  key = $2,
  name = $3,
  description = $4,
  tags = $5
WHERE key = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey.String(),
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Workspace.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func (r *Repo) Delete(
	ctx context.Context,
	a workspacemodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM workspace
WHERE key = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Workspace.String(),
			a,
			err,
		)
	}
	return nil
}
