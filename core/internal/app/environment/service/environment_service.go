package service

import (
	"context"
	environmentmodel "core/internal/app/environment/model"
	environmentrepo "core/internal/app/environment/repository"
	flagrepo "core/internal/app/flag/repository"
	sdkkeyrepo "core/internal/app/sdkkey/repository"
	targetingrepo "core/internal/app/targeting/repository"
	variationrepo "core/internal/app/variation/repository"
	"core/internal/pkg/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

type Service struct {
	Senv            *srvenv.Env
	EnvironmentRepo *environmentrepo.Repo
	SDKKeyRepo      *sdkkeyrepo.Repo
	FlagRepo        *flagrepo.Repo
	TargetingRepo   *targetingrepo.Repo
	VariationRepo   *variationrepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:            senv,
		EnvironmentRepo: environmentrepo.NewRepo(senv),
		SDKKeyRepo:      sdkkeyrepo.NewRepo(senv),
		FlagRepo:        flagrepo.NewRepo(senv),
		TargetingRepo:   targetingrepo.NewRepo(senv),
		VariationRepo:   variationrepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= service
func (s *Service) List(
	atk rsc.Token,
	a environmentmodel.RootArgs,
) ([]*environmentmodel.Environment, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessService); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.EnvironmentRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func (s *Service) Create(
	atk rsc.Token,
	i environmentmodel.Environment,
	a environmentmodel.RootArgs,
) (*environmentmodel.Environment, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.EnvironmentRepo.Create(ctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	if e.IsEmpty() {
		if err := auth.AddPolicy(
			s.Senv,
			atk,
			r.ID,
			rsc.Environment,
			rsc.AccessAdmin,
		); err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	if e.IsEmpty() {
		if err := s.createChildren(ctx, i, a); !err.IsEmpty() {
			e.Extend(err)
		}
	}

	return r, &e
}

// Get gets a resource instance given an atk & key
// (*) atk: access_type <= service
func (s *Service) Get(
	atk rsc.Token,
	a environmentmodel.ResourceArgs,
) (*environmentmodel.Environment, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.EnvironmentRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Environment,
		rsc.AccessService,
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
	a environmentmodel.ResourceArgs,
) (*environmentmodel.Environment, *res.Errors) {
	var o environmentmodel.Environment
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.EnvironmentRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Environment,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = s.EnvironmentRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a environmentmodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.EnvironmentRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Environment,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := s.EnvironmentRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
