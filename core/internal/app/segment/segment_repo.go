package segment

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
) (*[]Segment, error) {
	var o []Segment

	sqlStatement := `
SELECT
  s.id,
  s.key,
  s.name,
  s.description,
  s.tags
FROM segment s
LEFT JOIN project p
  ON p.id = s.project_id
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
		var _o Segment
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
	i Segment,
	a RootArgs,
) (*Segment, error) {
	var o Segment

	sqlStatement := `
INSERT INTO
  segment(
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
		rsc.Segment.String(),
		ResourceArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			SegmentKey:   i.Key,
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
) (*Segment, error) {
	var o Segment

	sqlStatement := `
SELECT
  s.id,
  s.key,
  s.name,
  s.description,
  s.tags
FROM segment s
LEFT JOIN project p
  ON p.id = s.project_id
LEFT JOIN workspace w
  ON w.id = p.workspace_id
WHERE w.key = $1
  AND p.key = $2
  AND s.key = $3`
	err := dbutil.ParseError(
		rsc.Segment.String(),
		a,
		sctx.DB.QueryRow(
			ctx,
			sqlStatement,
			a.WorkspaceKey,
			a.ProjectKey,
			a.SegmentKey,
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
	i Segment,
	a ResourceArgs,
) (*Segment, error) {
	sqlStatement := `
UPDATE segment
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
			rsc.Segment.String(),
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
DELETE FROM segment
WHERE key = $3
  AND project_id = (
    SELECT p.id
    FROM project p
    LEFT JOIN workspace w
      ON w.id = p.workspace_id
    WHERE w.key = $1
      AND p.key = $2
  )`
	if _, err := sctx.DB.Exec(
		ctx,
		sqlStatement,
		a.WorkspaceKey,
		a.ProjectKey,
		a.SegmentKey,
	); err != nil {
		return dbutil.ParseError(
			rsc.Segment.String(),
			a,
			err,
		)
	}
	return nil
}
