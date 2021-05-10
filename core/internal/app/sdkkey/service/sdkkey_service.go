package sdkkey

import (
	"context"
	sdkkeymodel "core/internal/app/sdkkey/model"
	sdkkeyrepo "core/internal/app/sdkkey/repository"
	"core/internal/pkg/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

type Service struct {
	Senv       *srvenv.Env
	SDKKeyRepo *sdkkeyrepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:       senv,
		SDKKeyRepo: sdkkeyrepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= service
func (s *Service) List(
	atk rsc.Token,
	a sdkkeymodel.RootArgs,
) (*[]sdkkeymodel.SDKKey, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessUser); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.SDKKeyRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func (s *Service) Create(
	atk rsc.Token,
	i sdkkeymodel.SDKKey,
	a sdkkeymodel.RootArgs,
) (*sdkkeymodel.SDKKey, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.SDKKeyRepo.Create(ctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	if e.IsEmpty() {
		if err := auth.AddPolicy(
			s.Senv,
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
func (s *Service) Get(
	atk rsc.Token,
	a sdkkeymodel.ResourceArgs,
) (*sdkkeymodel.SDKKey, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.SDKKeyRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
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
func (s *Service) Update(
	atk rsc.Token,
	patchDoc patch.Patch,
	a sdkkeymodel.ResourceArgs,
) (*sdkkeymodel.SDKKey, *res.Errors) {
	var o sdkkeymodel.SDKKey
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.SDKKeyRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
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

	r, err = s.SDKKeyRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a sdkkeymodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.SDKKeyRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.SDKKey,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := s.SDKKeyRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}

// -------- Custom Service Methods -------- //

// GetRootArgsFromSDKKey get root args from sdk key
func (s *Service) GetRootArgsFromSDKKey(
	clientKey string,
) (*sdkkeymodel.RootArgs, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	return s.SDKKeyRepo.GetRootArgsFromSDKKeyResource(
		ctx,
		clientKey,
	)
}

// GetRootArgsFromSDKKey get root args from server key
func (s *Service) GetRootArgsFromServerKey(
	serverKey string,
) (*sdkkeymodel.RootArgs, error) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	return s.SDKKeyRepo.GetRootArgsFromServerKeyResource(
		ctx,
		serverKey,
	)
}
