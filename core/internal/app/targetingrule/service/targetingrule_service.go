package service

import (
	"context"
	"core/internal/app/auth"
	targetingrulemodel "core/internal/app/targetingrule/model"
	targetingrulerepo "core/internal/app/targetingrule/repository"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

type Service struct {
	Senv              *srvenv.Env
	TargetingRuleRepo *targetingrulerepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:              senv,
		TargetingRuleRepo: targetingrulerepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= service
func (s *Service) List(
	atk rsc.Token,
	a targetingrulemodel.RootArgs,
) (*[]targetingrulemodel.TargetingRule, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessService); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.TargetingRuleRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= user
func (s *Service) Create(
	atk rsc.Token,
	i targetingrulemodel.TargetingRule,
	a targetingrulemodel.RootArgs,
) (*targetingrulemodel.TargetingRule, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessUser); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.TargetingRuleRepo.Create(ctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	if e.IsEmpty() {
		if err := auth.AddPolicy(
			s.Senv,
			atk,
			r.ID,
			rsc.TargetingRule,
			rsc.AccessUser,
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
	a targetingrulemodel.ResourceArgs,
) (*targetingrulemodel.TargetingRule, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.TargetingRuleRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.TargetingRule,
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
	a targetingrulemodel.ResourceArgs,
) (*targetingrulemodel.TargetingRule, *res.Errors) {
	var o targetingrulemodel.TargetingRule
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.TargetingRuleRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Targeting,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = s.TargetingRuleRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a targetingrulemodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.TargetingRuleRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Targeting,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := s.TargetingRuleRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
