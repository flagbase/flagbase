package service

import (
	"context"
	environmentrepo "core/internal/app/environment/repository"
	flagmodel "core/internal/app/flag/model"
	flagrepo "core/internal/app/flag/repository"
	targetingrepo "core/internal/app/targeting/repository"
	variationrepo "core/internal/app/variation/repository"
	"core/internal/pkg/authv2"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

type Service struct {
	Senv            *srvenv.Env
	FlagRepo        *flagrepo.Repo
	EnvironmentRepo *environmentrepo.Repo
	VariationRepo   *variationrepo.Repo
	TargetingRepo   *targetingrepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:            senv,
		FlagRepo:        flagrepo.NewRepo(senv),
		EnvironmentRepo: environmentrepo.NewRepo(senv),
		VariationRepo:   variationrepo.NewRepo(senv),
		TargetingRepo:   targetingrepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= service
func (s *Service) List(
	atk rsc.Token,
	a flagmodel.RootArgs,
) ([]*flagmodel.Flag, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	_, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.FlagRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func (s *Service) Create(
	atk rsc.Token,
	i flagmodel.Flag,
	a flagmodel.RootArgs,
) (*flagmodel.Flag, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	_, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.FlagRepo.Create(ctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
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
	a flagmodel.ResourceArgs,
) (*flagmodel.Flag, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	o, err := s.FlagRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return o, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func (s *Service) Update(
	atk rsc.Token,
	patchDoc patch.Patch,
	a flagmodel.ResourceArgs,
) (*flagmodel.Flag, *res.Errors) {
	var o flagmodel.Flag
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.FlagRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = s.FlagRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a flagmodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := s.FlagRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
