package flag

import (
	"context"
	cons "core/internal/constants"
	"core/internal/db"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"
	"core/pkg/auth"

	"github.com/lib/pq"
)

// List returns a list of resource instances
// (*) atk: access_type <= service
func List(
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o []Flag
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.ServiceAccess); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	rows, err := db.Pool.Query(ctx, `
  SELECT
    f.id, f.key, f.name, f.description, f.tags
  FROM
    workspace w, project p, flag f
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    p.workspace_id = w.id AND
    f.project_id = p.id
  `, workspaceKey, projectKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	for rows.Next() {
		var _o Flag
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.Name,
			&_o.Description,
			&_o.Tags,
		); err != nil {
			e.Append(cons.ErrorNotFound, err.Error())
		}
		o = append(o, _o)
	}

	return &res.Success{Data: o}, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func Create(
	atk rsc.Token,
	i Flag,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Flag
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.UserAccess); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	// create root user
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    flag(key, name, description, tags, project_id)
  VALUES
    ($1, $2, $3, $4, (
        SELECT
          p.id
        FROM
          workspace w, project p
        WHERE
          w.key = $5 AND
          p.key = $6 AND
          p.workspace_id = w.id
      )
    )
  RETURNING
    id, key, name, description, tags;`,
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
		workspaceKey,
		projectKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, o.ID, rsc.Flag, rsc.AdminAccess)
		if err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	return &res.Success{Data: o}, &e
}

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func Get(
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
) (*res.Success, *res.Errors) {
	var e res.Errors

	o, err := getResource(workspaceKey, projectKey, flagKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		o.ID,
		rsc.Flag,
		rsc.ServiceAccess,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func Update(
	atk rsc.Token,
	patchDoc patch.Patch,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Flag
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(workspaceKey, projectKey, flagKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.Flag,
		rsc.UserAccess,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	// apply patch and get modified document
	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	// update original with patched document
	if _, err := db.Pool.Exec(ctx, `
  UPDATE
    flag
  SET
    key = $2, name = $3, description = $4, tags = $5
  WHERE
    id = $1`,
		r.ID.String(),
		o.Key,
		o.Name,
		o.Description,
		pq.Array(o.Tags),
	); err != nil && err != context.Canceled {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func Delete(
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
) *res.Errors {
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(workspaceKey, projectKey, flagKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.Flag,
		rsc.AdminAccess,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if _, err := db.Pool.Exec(ctx, `
  DELETE FROM
    flag
  WHERE
    id = $1
  `,
		r.ID.String(),
	); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
