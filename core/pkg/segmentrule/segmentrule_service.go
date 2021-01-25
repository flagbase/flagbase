package segmentrule

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
	segmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o []SegmentRule
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
    sr.id,
    sr.key,
    sr.trait_key,
    sr.trait_value,
    sr.operator,
    sr.negate
  FROM
    workspace w,
    project p,
    segment s,
    segment_rule sr
  WHERE
    w.key = $1 AND
    p.key = $2 AND
    s.key = $3 AND
    p.workspace_id = w.id AND
    s.project_id = p.id AND
    sr.segment_id = s.id
  `, workspaceKey, projectKey, segmentKey)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	for rows.Next() {
		var _o SegmentRule
		if err = rows.Scan(
			&_o.ID,
			&_o.Key,
			&_o.TraitKey,
			&_o.TraitValue,
			&_o.Operator,
			&_o.Negate,
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
	i SegmentRule,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
	segmentKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o SegmentRule
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessUser); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	// create root user
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    segment(
      key,
      trait_key,
      trait_value,
      operator,
      negate,
      project_id
    )
  VALUES
    ($1, $2, $3, $4, $5, (
        SELECT
          s.id
        FROM
          workspace w, project p, segment s
        WHERE
          w.key = $6 AND
          p.key = $7 AND
          s.key = $8 AND
          p.workspace_id = w.id AND
          s.project_id = p.id
      )
    )
  RETURNING
    id
    key,
    trait_key,
    trait_value,
    operator,
    negate;`,
		i.Key,
		i.TraitKey,
		i.TraitValue,
		i.Operator,
		i.Negate,
		workspaceKey,
		projectKey,
		segmentKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.TraitKey,
		&o.TraitValue,
		&o.Operator,
		&o.Negate,
	); err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, o.ID, rsc.SegmentRule, rsc.AccessAdmin)
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
	segmentKey rsc.Key,
	segmentRuleKey rsc.Key,
) (*res.Success, *res.Errors) {
	var e res.Errors

	o, err := getResource(
		workspaceKey,
		projectKey,
		segmentKey,
		segmentRuleKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		o.ID,
		rsc.SegmentRule,
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
	segmentKey rsc.Key,
	segmentRuleKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o SegmentRule
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		workspaceKey,
		projectKey,
		segmentKey,
		segmentRuleKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.SegmentRule,
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
    segment
  SET
    key = $2,
    trait_key = $3,
    trait_value = $4,
    operator = $5,
    negate = $6
  WHERE
    id = $1`,
		r.ID.String(),
		&o.Key,
		&o.TraitKey,
		&o.TraitValue,
		&o.Operator,
		&o.Negate,
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
	segmentKey rsc.Key,
	segmentRuleKey rsc.Key,
) *res.Errors {
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// get original document
	r, err := getResource(
		workspaceKey,
		projectKey,
		segmentKey,
		segmentRuleKey,
	)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// authorize operation
	if err := auth.Enforce(
		atk,
		r.ID,
		rsc.SegmentRule,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if _, err := db.Pool.Exec(ctx, `
  DELETE FROM
    segment_rule
  WHERE
    id = $1
  `,
		r.ID.String(),
	); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
