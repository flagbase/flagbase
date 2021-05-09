package workspace

import (
	"context"
	"core/internal/app/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

// List returns a list of resource instances
// (*) atk: access_type <= root
func List(
	senv *srvenv.Env,
	atk rsc.Token,
	a RootArgs,
) (*[]Workspace, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(senv, atk, rsc.AccessRoot); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := listResource(ctx, senv, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= root
func Create(
	senv *srvenv.Env,
	atk rsc.Token,
	i Workspace,
	a RootArgs,
) (*Workspace, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(senv, atk, rsc.AccessRoot); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := createResource(ctx, senv, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// add policy for requesting user, after resource creation
	if e.IsEmpty() {
		if err := auth.AddPolicy(
			senv,
			atk,
			r.ID,
			rsc.Workspace,
			rsc.AccessAdmin,
		); err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	return r, &e
}

// Get gets a resource instance given an atk & workspaceKey
// (*) atk: access_type <= service
func Get(
	senv *srvenv.Env,
	atk rsc.Token,
	a ResourceArgs,
) (*Workspace, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, senv, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		senv,
		atk,
		r.ID,
		rsc.Workspace,
		rsc.AccessService,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	return r, &e
}

// Update updates resource instance given an atk, workspaceKey & patch object
// (*) atk: access_type <= user
func Update(
	senv *srvenv.Env,
	atk rsc.Token,
	patchDoc patch.Patch,
	a ResourceArgs,
) (*Workspace, *res.Errors) {
	var o Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, senv, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		senv,
		atk,
		r.ID,
		rsc.Workspace,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = updateResource(ctx, senv, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & workspaceKey
// (*) atk: access_type <= admin
func Delete(
	senv *srvenv.Env,
	atk rsc.Token,
	a ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, senv, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		senv,
		atk,
		r.ID,
		rsc.Workspace,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := deleteResource(ctx, senv, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
