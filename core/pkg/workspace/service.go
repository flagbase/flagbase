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

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func Get(atk rsc.Token, key rsc.Key) (
	*res.Success,
	*res.Errors,
) {
	var e res.Errors

	o, err := getByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		rsc.ID(o.ID),
		rsc.ServiceAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func Update(atk rsc.Token, key rsc.Key, p patch.Patch) (
	*res.Success,
	*res.Errors,
) {
	var o Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	w, err := getByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		rsc.ID(w.ID),
		rsc.UserAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
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

	return &res.Success{Data: o}, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func Delete(atk rsc.Token, key rsc.Key) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	w, err := getByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		rsc.ID(w.ID),
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
		key,
	); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	return &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= root
func Create(atk rsc.Token, i Workspace) (
	*res.Success,
	*res.Errors,
) {
	var w Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	a, err := auth.GetAccessFromToken(atk)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	} else if a.Type != rsc.RootAccess {
		e.Append(constants.AuthError, "You need root access to create a workspace")
		cancel()
	}

	// create root user
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    workspace(
      key, name, description, tags
    )
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

	// Add policy for requesting user
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, w.ID, rsc.AdminAccess)
		if err != nil {
			e.Append(constants.AuthError, err.Error())
		}
	}

	return &res.Success{Data: w}, &e
}

// List returns a list of resource instances
// (*) atk: access_type <= root
func List(atk rsc.Token) (
	*res.Success,
	*res.Errors,
) {
	var w []Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	rows, err := db.Pool.Query(ctx, `
  SELECT
    id, key, name, description, tags
  FROM
    workspace
  `)

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
