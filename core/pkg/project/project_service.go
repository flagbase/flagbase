package project

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
	var p []Project
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
    project
  `)

	for rows.Next() {
		var _p Project
		if err = rows.Scan(
			&_p.ID,
			&_p.Key,
			&_p.Name,
			&_p.Description,
			&_p.Tags,
		); err != nil {
			e.Append(constants.NotFoundError, err.Error())
		}
		p = append(p, _p)
	}

	return &res.Success{Data: p}, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= root
func Create(atk rsc.Token, i Project) (*res.Success, *res.Errors) {
	var p Project
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
    project(key, name, description, tags)
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
		&p.ID,
		&p.Key,
		&p.Name,
		&p.Description,
		&p.Tags,
	); err != nil {
		e.Append(constants.InputError, err.Error())
	}

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, p.ID, rsc.Project, rsc.AdminAccess)
		if err != nil {
			e.Append(constants.AuthError, err.Error())
		}
	}

	return &res.Success{Data: p}, &e
}

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func Get(atk rsc.Token, key rsc.Key) (*res.Success, *res.Errors) {
	var e res.Errors

	o, err := getByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		rsc.ID(o.ID),
		rsc.Project,
		rsc.ServiceAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func Update(atk rsc.Token, key rsc.Key, patchDoc patch.Patch) (*res.Success, *res.Errors) {
	var o Project
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	p, err := getByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		rsc.ID(p.ID),
		rsc.Project,
		rsc.UserAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	}

	// apply patch and get modified document
	if err := patch.Transform(p, patchDoc, &o); err != nil {
		e.Append(constants.InternalError, err.Error())
		cancel()
	}

	// update original with patched document
	if _, err := db.Pool.Exec(ctx, `
  UPDATE
    project
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
	p, err := getByKey(key)
	if err != nil {
		e.Append(constants.NotFoundError, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		rsc.ID(p.ID),
		rsc.Project,
		rsc.AdminAccess,
	); err != nil {
		e.Append(constants.AuthError, err.Error())
		cancel()
	}

	if _, err := db.Pool.Exec(ctx, `
  DELETE FROM
    project
  WHERE
    key = $1
  `,
		key,
	); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	return &e
}
