package variation

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/dbutil"

	"github.com/lib/pq"
)

func listResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a RootArgs,
) (*[]Variation, error) {
	var o []Variation
	sqlStatement := `
SELECT
  v.id,
  v.key,
  v.name,
  v.description,
  v.tags
FROM variation v
LEFT JOIN flag f
  ON f.id = v.flag_id
LEFT JOIN project p
  ON p.id = f.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2`
	rows, err := sctx.DB.Query(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
	)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var _o Variation
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.Name,
			&_o.Description,
			&_o.Tags,
		); err != nil {
			return nil, err
		}
		o = append(o, _o)
	}
	return &o, nil
}

func createResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Variation,
	a RootArgs,
) (*Variation, error) {
	var o Variation
	sqlStatement := `
INSERT INTO
  variation(
    key,
    name,
    description,
    tags,
    flag_id
  )
VALUES
  (
    $1,
    $2,
    $3,
    $4,
    (
      SELECT f.id
      FROM flag f
      LEFT JOIN project p
        ON p.id = f.project_id
      LEFT JOIN workspace w
        ON w.id = p.workspace_id
      WHERE w.key = $5
        AND p.key = $6
        AND f.key = $7
    )
  )
RETURNING
  id,
  key,
  name,
  description,
  tags;`
	err := dbutil.ParseError(
		rsc.Variation.String(),
		ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			FlagKey:      a.FlagKey,
			VariationKey: i.Key,
		},
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			i.Key,
			i.Name,
			i.Description,
			pq.Array(i.Tags),
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

func getResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
) (*Variation, error) {
	var o Variation
	sqlStatement := `
SELECT
  v.id,
  v.key,
  v.name,
  v.description,
  v.tags
FROM variation v
LEFT JOIN flag f
  ON f.id = v.flag_id
LEFT JOIN project p
  ON p.id = f.project_id
LEFT JOIN workspace w
  ON p.workspace_id = w.id
WHERE w.key = $1
  AND p.key = $2
  AND f.key = $3
  AND v.key = $4`
	err := dbutil.ParseError(
		rsc.Variation.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.FlagKey,
			a.VariationKey,
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

func updateResource(
	ctx context.Context,
	sctx *srv.Ctx,
	i Variation,
	a ResourceArgs,
) (*Variation, error) {
	sqlStatement := `
UPDATE variation
SET
  key = $2,
  name = $3,
  description = $4,
  tags = $5
WHERE id = $1`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		i.ID.String(),
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	); err != nil {
		return &i, dbutil.ParseError(
			rsc.Variation.String(),
			a,
			err,
		)
	}
	return &i, nil
}

func deleteResource(
	ctx context.Context,
	sctx *srv.Ctx,
	a ResourceArgs,
) error {
	sqlStatement := `
DELETE FROM variation
WHERE key = $4
  AND flag_id = (
    SELECT f.id
    FROM flag f
    LEFT JOIN project p
      ON p.id = f.project_id
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $1
      AND p.key = $2
      AND f.key = $3
    )`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.FlagKey,
		a.VariationKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Variation.String(),
			a,
			err,
		)
	}
	return nil
}
