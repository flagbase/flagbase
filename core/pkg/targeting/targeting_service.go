package targeting

import (
	"context"
	cons "core/internal/constants"
	"core/internal/db"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"
	"core/pkg/auth"
)

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= user
func Create(
	atk rsc.Token,
	i Targeting,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Targeting
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessUser); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	// create resource
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    targeting(enabled, fallthrough_variation_id, flag_id, environment_id)
  VALUES
    (
      $1,
      (
        SELECT
          v.id, f.id, e.id
        FROM
          workspace w,
          project p,
          environment e,
          flag f,
          variation v
        WHERE
          w.key = $3 AND
          p.key = $4 AND
          f.key = $5 AND
          e.key = $6 AND
          v.key = $2 AND
          p.workspace_id = w.id AND
          f.project_id = p.id AND
          e.project_id = p.id AND
          v.flag_id = f.id
      )
    )
  RETURNING
    id, enabled;`,
		i.Enabled,
		i.FallthroughVariationKey,
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Enabled,
	); err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}
	// todo: get variation key from db
	o.FallthroughVariationKey = &i.FallthroughVariationKey

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, o.ID, rsc.Targeting, rsc.AccessAdmin)
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
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var e res.Errors

	o, err := getResource(
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		o.ID,
		rsc.Targeting,
		rsc.AccessService,
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
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Targeting
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.Targeting,
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
	if _, err := db.Pool.Exec(ctx, `
  UPDATE
    targeting
  SET
    enabled = $2, fallthrough_variation_id = (
      SELECT
        v.id
      FROM
        workspace w,
        project p,
        environment e,
        flag f,
        variation v
      WHERE
        w.key = $4 AND
        p.key = $5 AND
        f.key = $6 AND
        e.key = $7 AND
        v.key = $3 AND
        p.workspace_id = w.id AND
        f.project_id = p.id AND
        v.flag_id = f.id
    )
  WHERE
    id = $1`,
		r.ID.String(),
		o.Enabled,
		o.FallthroughVariationKey,
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
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
	environmentKey rsc.Key,
) *res.Errors {
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.Targeting,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if _, err := db.Pool.Exec(ctx, `
  DELETE FROM
    targeting
  WHERE
    id = $1
  `,
		r.ID.String(),
	); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
