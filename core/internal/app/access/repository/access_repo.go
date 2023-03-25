package repository

import (
	"context"
	accessmodel "core/internal/app/access/model"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/dbutil"
	"database/sql"

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
	a accessmodel.RootArgs,
) ([]*accessmodel.Access, error) {
	var o []*accessmodel.Access
	sqlStatement := `
SELECT
	a.key,
	a.encrypted_secret,
	a.type,
	a.expires_at,
	a.name,
	a.description,
	a.tags,
	a.scope,
	COALESCE(w.key, '') AS workspace_key,
	COALESCE(p.key, '') AS project_key
FROM access a
LEFT JOIN workspace w
	ON w.id = a.workspace_id
LEFT JOIN project p
	ON p.id = a.project_id`
	rows, err := r.DB.Query(ctx, sqlStatement)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o accessmodel.Access
		if err = rows.Scan(
			&_o.Key,
			&_o.Secret,
			&_o.Type,
			&_o.ExpiresAt,
			&_o.Name,
			&_o.Description,
			&_o.Tags,
			&_o.Scope,
			&_o.WorkspaceKey,
			&_o.ProjectKey,
		); err != nil {
			return nil, err
		}
		o = append(o, &_o)
	}
	return o, nil
}

func (r *Repo) Create(
	ctx context.Context,
	i accessmodel.Access,
) (*accessmodel.Access, error) {
	var o accessmodel.Access
	var workspaceID, projectID sql.NullString

	sqlStatement := `
INSERT INTO
  access(
    key,
    encrypted_secret,
    type,
    expires_at,
    name,
    description,
    tags,
	scope,
	workspace_id,
	project_id
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
	(
        SELECT id
        FROM workspace
        WHERE key = $9
        AND $9 <> ''
    ),
    (
        SELECT p.id
        FROM workspace w
        LEFT JOIN project p 
            ON p.workspace_id = w.id 
        WHERE w.key = $9 
        AND p.key = $10
        AND $9 <> ''
        AND $10 <> ''
    )
  )
RETURNING
	key,
	type,
	expires_at,
	name,
	description,
	tags,
	scope,
    (
        SELECT key::text
        FROM workspace
        WHERE id::text = workspace_id::text
        AND workspace_id IS NOT NULL
    ),
    (
        SELECT p.key::text
        FROM workspace w
        LEFT JOIN project p 
            ON p.workspace_id = w.id 
        WHERE w.id = workspace_id 
        AND p.id = project_id
        AND workspace_id IS NOT NULL
        AND project_id IS NOT NULL
    );`

	err := dbutil.ParseError(
		rsc.Access.String(),
		i,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Secret,
			i.Type,
			i.ExpiresAt,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
			i.Scope,
			i.WorkspaceKey,
			i.ProjectKey,
		).Scan(
			&o.Key,
			&o.Type,
			&o.ExpiresAt,
			&o.Name,
			&o.Description,
			&o.Tags,
			&o.Scope,
			&workspaceID,
			&projectID,
		),
	)

	if workspaceID.Valid {
		o.WorkspaceKey = workspaceID.String
	} else {
		o.WorkspaceKey = i.WorkspaceKey
	}

	if projectID.Valid {
		o.ProjectKey = projectID.String
	} else {
		o.ProjectKey = i.ProjectKey
	}

	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	i accessmodel.KeySecretPair,
) (*accessmodel.Access, error) {
	var o accessmodel.Access
	sqlStatement := `
SELECT
	a.id,
	a.key,
	a.name,
	a.description,
	a.tags,
	a.type,
	a.expires_at,
	a.encrypted_secret,
	a.scope
FROM access a
WHERE a.key = $1`
	err := dbutil.ParseError(
		rsc.Access.String(),
		i,
		r.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
		).Scan(
			&o.ID,
			&o.Key,
			&o.Name,
			&o.Description,
			&o.Tags,
			&o.Type,
			&o.ExpiresAt,
			&o.Secret,
			&o.Scope,
		),
	)
	return &o, err
}

func (r *Repo) Update(
	ctx context.Context,
	i accessmodel.Access,
	a accessmodel.ResourceArgs,
) (*accessmodel.Access, error) {
	sqlStatement := `
UPDATE access
SET
	key = $2,
	name = $3,
	description = $4,
	tags = COALESCE($5, ARRAY[]::resource_tags),
	type = $6,
	expires_at = $7,
	encrypted_secret = $8,
	scope = $9,
	workspace_id = (
		SELECT id
		FROM workspace
		WHERE key = NULLIF($10, '')
	),
	project_id = (
		SELECT p.id
		FROM workspace w
		LEFT JOIN project p 
			ON p.workspace_id = w.id 
		WHERE w.key = NULLIF($10, '')
		AND p.key = NULLIF($11, '')
	)
WHERE key = $1;`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.AccessKey.String(),
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
		i.Type,
		i.ExpiresAt,
		i.Secret,
		i.Scope,
		i.WorkspaceKey,
		i.ProjectKey,
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
	a accessmodel.ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM access
WHERE key = $1`
	if _, err := r.DB.Exec(
		ctx,
		sqlStatement,
		a.AccessKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Workspace.String(),
			a,
			err,
		)
	}
	return nil
}
