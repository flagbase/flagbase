package service

import (
	"context"
	environmentrepo "core/internal/app/environment/repository"
	projectmodel "core/internal/app/project/model"
	projectrepo "core/internal/app/project/repository"
	sdkkeyrepo "core/internal/app/sdkkey/repository"
	"core/internal/pkg/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
)

type Service struct {
	Senv            *srvenv.Env
	ProjectRepo     *projectrepo.Repo
	EnvironmentRepo *environmentrepo.Repo
	SDKKeyRepo      *sdkkeyrepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:            senv,
		ProjectRepo:     projectrepo.NewRepo(senv),
		EnvironmentRepo: environmentrepo.NewRepo(senv),
		SDKKeyRepo:      sdkkeyrepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= service
func (s *Service) List(
	atk rsc.Token,
	a projectmodel.RootArgs,
) (*[]projectmodel.Project, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessService); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.ProjectRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func (s *Service) Create(
	atk rsc.Token,
	i projectmodel.Project,
	a projectmodel.RootArgs,
) (*projectmodel.Project, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	if err := auth.Authorize(s.Senv, atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.ProjectRepo.Create(ctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// add policy for requesting user, after resource creation
	if e.IsEmpty() {
		if err := auth.AddPolicy(
			s.Senv,
			atk,
			r.ID,
			rsc.Project,
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
	a projectmodel.ResourceArgs,
) (*projectmodel.Project, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.ProjectRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Project,
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
	a projectmodel.ResourceArgs,
) (*projectmodel.Project, *res.Errors) {
	var o projectmodel.Project
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.ProjectRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Project,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = s.ProjectRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & key
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a projectmodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.ProjectRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Project,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := s.ProjectRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
