package workspace

import (
	"context"
	"core/internal/constants"
	"core/internal/db"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"
	"core/pkg/auth"

	"github.com/lib/pq"
)

// List returns a list of resource instances
// (*) atk: access_type <= root
func List(atk rsc.Token) (*res.Success, *res.Errors) {
	var w []Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.RootAccess); err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	}

	rows, err := db.Pool.Query(ctx, `
  SELECT
    id, key, name, description, tags
  FROM
    workspace
  `)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
	}

	for rows.Next() {
		var _w Workspace
		if err = rows.Scan(
			&_w.ID,
			&_w.Key,
			&_w.Name,
			&_w.Description,
			&_w.Tags,
		); err != nil {
			e.Append(constants.NotFoundError, err.Error())
		}
		w = append(w, _w)
	}

	return &res.Success{Data: w}, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= root
func Create(atk rsc.Token, i Workspace) (*res.Success, *res.Errors) {
	var w Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.RootAccess); err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	}

	// create root user
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    workspace(key, name, description, tags)
  VALUES
    ($1, $2, $3, $4)
  RETURNING
    id, key, name, description, tags;`,
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	)
	if err := row.Scan(
		&w.ID,
		&w.Key,
		&w.Name,
		&w.Description,
		&w.Tags,
	); err != nil {
		e.Append(constants.InputError, err.Error())
	}

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, w.ID, rsc.Workspace, rsc.AdminAccess)
		if err != nil {
			e.Append(constants.AuthError, err.Error())
		}
	}

	return &res.Success{Data: w}, &e
}

// Get gets a resource instance given an atk & workspaceKey
// (*) atk: access_type <= service
func Get(atk rsc.Token, workspaceKey rsc.Key) (*res.Success, *res.Errors) {
	var e res.Errors

	o, err := getResource(workspaceKey)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		o.ID,
		rsc.Workspace,
		rsc.ServiceAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Update updates resource instance given an atk, workspaceKey & patch object
// (*) atk: access_type <= user
func Update(atk rsc.Token, workspaceKey rsc.Key, patchDoc patch.Patch) (*res.Success, *res.Errors) {
	var o Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	w, err := getResource(workspaceKey)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		w.ID,
		rsc.Workspace,
		rsc.UserAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	}

	// apply patch and get modified document
	if err := patch.Transform(w, patchDoc, &o); err != nil {
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
		workspaceKey,
		o.Key,
		o.Name,
		o.Description,
		pq.Array(o.Tags),
	); err != nil && err != context.Canceled {
		e.Append(constants.InternalError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Delete deletes a resource instance given an atk & workspaceKey
// (*) atk: access_type <= admin
func Delete(atk rsc.Token, workspaceKey rsc.Key) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	w, err := getResource(workspaceKey)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		w.ID,
		rsc.Workspace,
		rsc.AdminAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	}

	if _, err := db.Pool.Exec(ctx, `
  DELETE FROM
    workspace
  WHERE
    key = $1
  `,
		workspaceKey,
	); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	return &e
}
