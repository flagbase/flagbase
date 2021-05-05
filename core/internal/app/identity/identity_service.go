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
	a RootArgs,
) (*res.Success, *res.Errors) {
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(sctx, atk, rsc.AccessService); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := listResource(ctx, sctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return &res.Success{Data: r}, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func Create(
	sctx *srv.Ctx,
	atk rsc.Token,
	i Identity,
	a RootArgs,
) (*res.Success, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(sctx, atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := createResource(ctx, sctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	if e.IsEmpty() {
		if err := auth.AddPolicy(
			sctx,
			atk,
			r.ID,
			rsc.Identity,
			rsc.AccessAdmin,
		); err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	return &res.Success{Data: r}, &e
}

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func Get(
	sctx *srv.Ctx,
	atk rsc.Token,
	a ResourceArgs,
) (*res.Success, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, sctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

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
	a ResourceArgs,
) (*res.Success, *res.Errors) {
	var o Identity
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, sctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

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

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = updateResource(ctx, sctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &res.Success{Data: r}, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func Delete(
	sctx *srv.Ctx,
	atk rsc.Token,
	a ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, sctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

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

	if err := deleteResource(ctx, sctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
