package targetingrule

import (
	"context"
	cons "core/internal/constants"
	"core/internal/db"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"
	"core/pkg/auth"
)

// List returns a list of resource instances
// (*) atk: access_type <= service
func List(
	atk rsc.Token,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o []TargetingRule
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessService); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	rows, err := db.Pool.Query(ctx, `
    SELECT
      tr.id,
      tr.key,
      tr.type,
      tr.matches,
	    (
	      SELECT i.key
	      FROM identity i
	      WHERE i.id = tr.identity_id
	    ) as identity_key,
	    (
	      SELECT s.key
	      FROM segment s
	      WHERE s.id = tr.segment_id
	    ) as segment_key,
	    (
	      SELECT v.key
	      FROM variation v
	      WHERE v.id = tr.variation_id
	    ) as variation_key
    FROM
      workspace w,
      project p,
      flag f,
      environment e,
      targeting t,
      targeting_rule tr
    WHERE
      w.key = $1 AND
      p.key = $2 AND
      f.key = $3 AND
      e.key = $4 AND
      p.workspace_id = w.id AND
      f.project_id = p.id AND
      e.project_id = p.id AND
      t.environment_id = e.id AND
      t.flag_id = f.id AND
      tr.targeting_id = t.id
    `,
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	for rows.Next() {
		var _o TargetingRule
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.Type,
			&_o.Matches,
			&_o.IdentityKey,
			&_o.SegmentKey,
			&_o.VariationKey,
		); err != nil {
			e.Append(cons.ErrorNotFound, err.Error())
		}
		o = append(o, _o)
	}

	return &res.Success{Data: o}, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= user
func Create(
	atk rsc.Token,
	i TargetingRule,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	flagKey rsc.Key,
	environmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o TargetingRule
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
    targeting_rule(
      key,
      type,
      matches,
      identity_id,
      segment_id,
      variation_id,
      targeting_id
    )
  VALUES
    (
      $1,
      $2,
      $3,
      (
        SELECT
          i.id, s.id, v.id, t.id
        FROM
          workspace w,
          project p,
          environment e,
          flag f,
          variation v,
          segment s,
          identity i,
          targeting t
        WHERE
          i.key = $4 AND
          s.key = $5 AND
          v.key = $6 AND
          w.key = $7 AND
          p.key = $8 AND
          f.key = $9 AND
          e.key = $10 AND
          p.workspace_id = w.id AND
          f.project_id = p.id AND
          e.project_id = p.id AND
          v.flag_id = f.id AND
          s.project_id = p.id AND
          i.environment_id = e.id AND
          t.flag_id = f.id AND
          t.environment = e.id
      )
    )
  RETURNING
    id, key, type, matches;`,
		i.Key,
		i.Type,
		i.Matches,
		i.IdentityKey.String(),
		i.SegmentKey.String(),
		i.VariationKey.String(),
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Type,
		&o.Matches,
	); err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}
	// todo: get keys from db
	o.IdentityKey = i.IdentityKey
	o.SegmentKey = i.SegmentKey
	o.VariationKey = i.VariationKey

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, o.ID, rsc.TargetingRule, rsc.AccessAdmin)
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
	ruleKey rsc.Key,
) (*res.Success, *res.Errors) {
	var e res.Errors

	o, err := getResource(
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
		ruleKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		o.ID,
		rsc.TargetingRule,
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
	ruleKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o TargetingRule
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		workspaceKey,
		projectKey,
		flagKey,
		environmentKey,
		ruleKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.TargetingRule,
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
    targeting_rule
  SET
    key = $2,
    type = $3,
    matches = $4,
    identity_id = (
      SELECT
        i.id
      FROM
        workspace w, project p, environment e, identity i
      WHERE
        w.key = $8 AND
        p.key = $9 AND
        e.key = $11 AND
        i.key = $5 AND
        p.workspace_id = w.id AND
        e.project_id = p.id AND
        i.environment_id = e.id
    ),
    segment_id = (
      SELECT
        s.id
      FROM
        workspace w, project p, segment s
      WHERE
        w.key = $8 AND
        p.key = $9 AND
        s.key = $6 AND
        p.workspace_id = w.id AND
        s.project_id = p.id
    ),
    variation_id = (
      SELECT
        v.id
      FROM
        workspace w, project p, flag f, variation v
      WHERE
        w.key = $8 AND
        p.key = $9 AND
        f.key = $10 AND
        v.key = $7 AND
        p.workspace_id = w.id AND
        f.project_id = p.id AND
        v.flag_id = f.id
    )
  WHERE
    id = $1`,
		r.ID.String(),
		o.Key.String(),
		o.Type.String(),
		o.Matches,
		o.IdentityKey.String(),
		o.SegmentKey.String(),
		o.VariationKey.String(),
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
	ruleKey rsc.Key,
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
		ruleKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.TargetingRule,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if _, err := db.Pool.Exec(ctx, `
  DELETE FROM
    targeting_rule
  WHERE
    id = $1
  `,
		r.ID.String(),
	); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
