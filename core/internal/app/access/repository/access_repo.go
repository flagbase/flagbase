package repository

import (
	"context"
	accessmodel "core/internal/app/access/model"
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

func (r *Repo) Create(
	ctx context.Context,
	i accessmodel.Access,
) (*accessmodel.Access, error) {
	var o accessmodel.Access
	sqlStatement := `
INSERT INTO
  access(
    key,
    encrypted_secret,
    type,
    expires_at,
    name,
    description,
    tags
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7
  )
RETURNING
  key,
  type,
  expires_at,
  name,
  description,
  tags;
	`
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
		).Scan(
			&o.Key,
			&o.Type,
			&o.ExpiresAt,
			&o.Name,
			&o.Description,
			&o.Tags,
		),
	)
	return &o, err
}

func (r *Repo) Get(
	ctx context.Context,
	i accessmodel.KeySecretPair,
) (*accessmodel.Access, error) {
	var o accessmodel.Access
	sqlStatement := `
SELECT
  id,
  key,
  name,
  description,
  tags,
  type,
  expires_at,
  encrypted_secret
FROM
  access
WHERE
  key = $1
	`
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
		),
	)
	return &o, err
}
