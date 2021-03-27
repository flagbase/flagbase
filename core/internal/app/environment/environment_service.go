package environment

import (
	"context"
	"core/internal/app/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/patch"
	res "core/pkg/response"

	"github.com/lib/pq"
)

// List returns a list of resource instances
// (*) atk: access_type <= service
func List(
	sctx *srv.Ctx,
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o []Environment
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
    e.id, e.key, e.name, e.description, e.tags
  FROM
    workspace w, project p, environment e
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    p.workspace_id = w.id AND
    e.project_id = p.id
  `, workspaceKey, projectKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	for rows.Next() {
		var _o Environment
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
	sctx *srv.Ctx,
	atk rsc.Token,
	i Environment,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Environment
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
    environment(key, name, description, tags, project_id)
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
		if err := auth.AddPolicyV2(
			sctx,
			atk,
			o.ID,
			rsc.Environment,
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
) (*res.Success, *res.Errors) {
	var e res.Errors

	r, err := getResource(sctx, workspaceKey, projectKey, environmentKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// authorize operation
	if err := auth.EnforceV2(
		sctx,
		atk,
		r.ID,
		rsc.Environment,
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
) (*res.Success, *res.Errors) {
	var o Environment
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(sctx, workspaceKey, projectKey, environmentKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.EnforceV2(
		sctx,
		atk,
		r.ID,
		rsc.Environment,
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
    environment
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
	sctx *srv.Ctx,
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	environmentKey rsc.Key,
) *res.Errors {
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(sctx, workspaceKey, projectKey, environmentKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.EnforceV2(
		sctx,
		atk,
		r.ID,
		rsc.Environment,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if _, err := sctx.DB.Exec(ctx, `
  DELETE FROM
    environment
  WHERE
    id = $1
  `,
		r.ID.String(),
	); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
