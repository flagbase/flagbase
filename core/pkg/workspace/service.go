package workspace

import (
	"context"
	"core/internal/constants"
	"core/internal/db"
	"core/internal/patch"
	"core/internal/resource"
	"core/internal/response"
	"core/pkg/auth"

	"github.com/lib/pq"
)

// GetWorkspace get workspace service
func GetWorkspace(atk resource.Token, key resource.Key) (
	*response.Success,
	*response.Errors,
) {
	var e response.Errors

	o, err := getWorkspaceByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
	}

	if err := auth.Enforce(atk, resource.ID(o.ID), "service"); err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	return &response.Success{Data: o}, &e
}

// UpdateWorkspace update workspace service
func UpdateWorkspace(key resource.Key, p patch.Patch) (
	*response.Success,
	*response.Errors,
) {
	var o Workspace
	var e response.Errors
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

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
  UPDATE
    workspace
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

	return &response.Success{Data: o}, &e
}

// DeleteWorkspace delete workspace given its key
func DeleteWorkspace(key string) *response.Errors {
	var e response.Errors

	if _, err := db.Pool.Exec(context.Background(), `
  DELETE FROM
    workspace
  WHERE
    key = $1
  `,
		key,
	); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	return &e
}

// CreateWorkspace get a workspace using its key
func CreateWorkspace(i Workspace) (
	*response.Success,
	*response.Errors,
) {
	var o Workspace
	var e response.Errors

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

	if e.Errors == nil {
		// TODO: check
	}

	return &response.Success{Data: o}, &e
}

// ListWorkspaces list workspace service
func ListWorkspaces() (
	*response.Success,
	*response.Errors,
) {
	var o []Workspace
	var e response.Errors

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

	return &response.Success{Data: o}, &e
}
