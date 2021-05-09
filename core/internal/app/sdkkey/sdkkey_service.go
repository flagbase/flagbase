package sdkkey

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
// (*) atk: access_type <= service
func List(
	senv *srvenv.Env,
	atk rsc.Token,
	a RootArgs,
) (*[]SDKKey, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(senv, atk, rsc.AccessUser); err != nil {
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
// (*) atk: access_type <= admin
func Create(
	senv *srvenv.Env,
	atk rsc.Token,
	i SDKKey,
	a RootArgs,
) (*SDKKey, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(senv, atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := createResource(ctx, senv, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	if e.IsEmpty() {
		if err := auth.AddPolicy(
			senv,
			atk,
			r.ID,
			rsc.SDKKey,
			rsc.AccessAdmin,
		); err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	return r, &e
}

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func Get(
	senv *srvenv.Env,
	atk rsc.Token,
	a ResourceArgs,
) (*SDKKey, *res.Errors) {
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
		rsc.SDKKey,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	return r, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func Update(
	senv *srvenv.Env,
	atk rsc.Token,
	patchDoc patch.Patch,
	a ResourceArgs,
) (*SDKKey, *res.Errors) {
	var o SDKKey
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
		rsc.SDKKey,
		rsc.AccessAdmin,
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

// Delete deletes a resource instance given an atk & key
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
	}

	if err := auth.Enforce(
		senv,
		atk,
		r.ID,
		rsc.SDKKey,
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

// -------- Custom Service Methods -------- //

// GetRootArgsFromSDKKey get root args from sdk key
func GetRootArgsFromSDKKey(
	senv *srvenv.Env,
	clientKey string,
) (*RootArgs, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	return getRootArgsFromSDKKeyResource(
		ctx,
		senv,
		clientKey,
	)
}

// GetRootArgsFromSDKKey get root args from server key
func GetRootArgsFromServerKey(
	senv *srvenv.Env,
	serverKey string,
) (*RootArgs, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	return getRootArgsFromServerKeyResource(
		ctx,
		senv,
		serverKey,
	)
}
