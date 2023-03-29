package service

import (
	"context"
	environmentrepo "core/internal/app/environment/repository"
	targetingrepo "core/internal/app/targeting/repository"
	targetingrulerepo "core/internal/app/targetingrule/repository"
	variationmodel "core/internal/app/variation/model"
	variationrepo "core/internal/app/variation/repository"
	"core/internal/pkg/authutil"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

type Service struct {
	Senv              *srvenv.Env
	VariationRepo     *variationrepo.Repo
	EnvironmentRepo   *environmentrepo.Repo
	TargetingRepo     *targetingrepo.Repo
	TargetingRuleRepo *targetingrulerepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:              senv,
		VariationRepo:     variationrepo.NewRepo(senv),
		EnvironmentRepo:   environmentrepo.NewRepo(senv),
		TargetingRepo:     targetingrepo.NewRepo(senv),
		TargetingRuleRepo: targetingrulerepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= service
func (s *Service) List(
	atk rsc.Token,
	a variationmodel.RootArgs,
) ([]*variationmodel.Variation, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	_, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.VariationRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func (s *Service) Create(
	atk rsc.Token,
	i variationmodel.Variation,
	a variationmodel.RootArgs,
) (*variationmodel.Variation, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	_, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.VariationRepo.Create(ctx, i, a)
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
	a variationmodel.ResourceArgs,
) (*variationmodel.Variation, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.VariationRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Update updates resource instance given an atk, key & patch object
// (*) atk: access_type <= user
func (s *Service) Update(
	atk rsc.Token,
	patchDoc patch.Patch,
	a variationmodel.ResourceArgs,
) (*variationmodel.Variation, *res.Errors) {
	var o variationmodel.Variation
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.VariationRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = s.VariationRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a variationmodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := s.VariationRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
