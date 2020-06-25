package workspace

import (
  "context"
	"core/internal/constants"
	"core/internal/patch"
	"core/internal/db"
	res "core/internal/response"

	"github.com/lib/pq"
)

// GetWorkspace get workspace service
func GetWorkspace(key string) (
	*res.Success,
	*res.Errors,
) {
	var e res.Errors

	o, err := getWorkspaceByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// UpdateWorkspace update workspace service
func UpdateWorkspace(key string, p patch.Patch) (
	*res.Success,
	*res.Errors,
) {
  var o Workspace
	var e res.Errors
  ctx := context.Background()
  ctx, cancel := context.WithCancel(ctx)

	// get original document
	w, err := getWorkspaceByKey(key)
	if err != nil {
    e.Append(constants.NotFoundError, err.Error())
    cancel()
	}

  // apply patch and get modified document
  if err := patch.Transform(w, p, &o); err != nil {
		e.Append(constants.InternalError, err.Error())
    cancel()
  }

  // update original with patched document
	if _, err := db.Pool.Exec(ctx, `
  UPDATE workspace
  SET
    key = $2, name = $3, description = $4, tags = $5
  WHERE
    key = $1`,
		key,
		o.Key,
		o.Name,
		o.Description,
		pq.Array(o.Tags),
  ); err != nil && err != context.Canceled {
    e.Append(constants.InternalError, err.Error())
  }

	return &res.Success{Data: o}, &e
}

// DeleteWorkspace delete workspace service
func DeleteWorkspace(key string) *res.Errors {

	return nil
}

// CreateWorkspace get a workspace using its key
func CreateWorkspace(i Workspace) (
	*res.Success,
	*res.Errors,
) {
	var o Workspace
	var e res.Errors

	// create root user
	row := db.Pool.QueryRow(context.Background(), `
  INSERT INTO
    workspace(
      key, name, description, tags
    )
  VALUES
    ($1, $2, $3, $4)
  RETURNING
    key, name, description, tags;`,
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	)
	if err := row.Scan(
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		e.Append(constants.InputError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// ListWorkspaces list workspace service
func ListWorkspaces() (
	*res.Success,
	*res.Errors,
) {
	var o []Workspace
	var e res.Errors

	rows, err := db.Pool.Query(context.Background(), `
  SELECT
    key, name, description, tags
  FROM
    workspace
  `)

	for rows.Next() {
		var w Workspace
		if err = rows.Scan(
			&w.Key,
			&w.Name,
			&w.Description,
			&w.Tags,
		); err != nil {
			e.Append("NotFound", err.Error())
		}
		o = append(o, w)
	}

	return &res.Success{Data: o}, &e
}
