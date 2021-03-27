package identity

import (
	"context"
	"core/internal/app/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/patch"
	res "core/pkg/response"
)

// List returns a list of resource instances
// (*) atk: access_type <= service
func List(
	sctx *srv.Ctx,
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o []Identity
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessService); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	rows, err := sctx.DB.Query(ctx, `
  SELECT
    i.id, i.key
  FROM
    workspace w,
    project p,
    environment e,
    identity i
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    e.key = $3 AND
    p.workspace_id = w.id AND
    e.project_id = p.id AND
    i.environment_key = e.id
  `, workspaceKey, projectKey, environmentKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	for rows.Next() {
		var _o Identity
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
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
	sctx *srv.Ctx,
	atk rsc.Token,
	i Identity,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Identity
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	// create root user
	row := sctx.DB.QueryRow(ctx, `
  INSERT INTO
    identity(key, environment_id)
  VALUES
    ($1, $2, (
        SELECT
          e.id
        FROM
          workspace w, project p, environment e
        WHERE
          w.key = $3 AND
          p.key = $4 AND
          p.key = $5 AND
          p.workspace_id = w.id AND
          e.project_id = p.id
      )
    )
  RETURNING
    id, key;`,
		i.Key,
		workspaceKey,
		projectKey,
		environmentKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
	); err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		if err := auth.AddPolicy(
			sctx,
			atk,
			o.ID,
			rsc.Identity,
			rsc.AccessAdmin,
		); err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	return &res.Success{Data: o}, &e
}

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func Get(
	sctx *srv.Ctx,
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
	identityKey rsc.Key,
) (*res.Success, *res.Errors) {
	var e res.Errors

	r, err := getResource(
		sctx,
		workspaceKey,
		projectKey,
		environmentKey,
		identityKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		sctx,
		atk,
		r.ID,
		rsc.Identity,
		rsc.AccessService,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	return &res.Success{Data: r}, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func Update(
	sctx *srv.Ctx,
	atk rsc.Token,
	patchDoc patch.Patch,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
	identityKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Identity
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		sctx,
		workspaceKey,
		projectKey,
		environmentKey,
		identityKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		sctx,
		atk,
		r.ID,
		rsc.Identity,
		rsc.AccessUser,
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
	if _, err := sctx.DB.Exec(ctx, `
  UPDATE
    identity
  SET
    key = $2
  WHERE
    id = $1`,
		r.ID.String(),
		o.Key,
	); err != nil && err != context.Canceled {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func Delete(
	sctx *srv.Ctx,
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
	identityKey rsc.Key,
) *res.Errors {
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		sctx,
		workspaceKey,
		projectKey,
		environmentKey,
		identityKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		sctx,
		atk,
		r.ID,
		rsc.Identity,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if _, err := sctx.DB.Exec(ctx, `
  DELETE FROM
    identity
  WHERE
    id = $1
  `,
		r.ID.String(),
	); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
