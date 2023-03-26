package service

import (
	"context"
	environmentrepo "core/internal/app/environment/repository"
	projectmodel "core/internal/app/project/model"
	projectrepo "core/internal/app/project/repository"
	sdkkeyrepo "core/internal/app/sdkkey/repository"
	"core/internal/pkg/authutil"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
	"fmt"
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
) ([]*projectmodel.Project, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.ProjectRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// Enforce access requirements
	if acc.Type != rsc.AccessRoot.String() {
		// only list scoped projects
		for _, _r := range r {
			if acc.Scope == rsc.AccessScopeWorkspace.String() && a.WorkspaceKey.String() != acc.WorkspaceKey {
				// if access scoped to workspace, then list out all projects in that workspace
				_r.ID = "redacted"
			} else if acc.Scope == rsc.AccessScopeProject.String() && (a.WorkspaceKey.String() != acc.WorkspaceKey || _r.Key.String() != acc.ProjectKey) {
				// if access scoped to project, then only list out scoped project
				_r.ID = "redacted"
			}
		}
	}
	// otherwise
	// * get all projects if root

	// Filter eligible items
	filtered := make([]*projectmodel.Project, 0)
	for _, _r := range r {
		if _r.ID != "redacted" {
			filtered = append(filtered, _r)
		}
	}

	return filtered, &e
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

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessUser.String() || acc.Type == rsc.AccessService.String() {
		// user/service is unauthorized to a create project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is unauthorized to create a project", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() {
		// admins scoped in project is unauthorized to a create project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to project %s is unauthorized to create a project", acc.Type, acc.ProjectKey))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != a.WorkspaceKey.String() {
		// admins scoped in workspace, outside their scope is unauthorized to a create project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is unauthorized to create a project in this workspace", acc.Type, acc.WorkspaceKey))
		cancel()
	}
	// otherwise
	// * create any project if root

	r, err := s.ProjectRepo.Create(ctx, i, a)
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
	a projectmodel.ResourceArgs,
) (*projectmodel.Project, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	// Enforce access requirements
	if acc.Type != rsc.AccessRoot.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != a.WorkspaceKey.String() {
		// admin/user/service scoped to workspace can only get project from scoped workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is unauthorized to get project", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type != rsc.AccessRoot.String() && acc.Scope == rsc.AccessScopeProject.String() && (acc.WorkspaceKey != a.WorkspaceKey.String() || acc.ProjectKey != a.ProjectKey.String()) {
		// admin/user/service scoped to project can only get project from scoped project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s and project %s is unauthorized to get project", acc.Type, acc.WorkspaceKey, acc.ProjectKey))
		cancel()
	}
	// otherwise
	// * get any project if root

	r, err := s.ProjectRepo.Get(ctx, a)
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
	a projectmodel.ResourceArgs,
) (*projectmodel.Project, *res.Errors) {
	var o projectmodel.Project
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessService.String() {
		// service can not update project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is unauthorized to update project", acc.Type))
		cancel()
	} else if acc.Type != rsc.AccessRoot.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != a.WorkspaceKey.String() {
		// admin/user scoped to workspace can only update project from scoped workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is unauthorized to update project", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type != rsc.AccessRoot.String() && acc.Scope == rsc.AccessScopeProject.String() && (acc.WorkspaceKey != a.WorkspaceKey.String() || acc.ProjectKey != a.ProjectKey.String()) {
		// admin/user/service scoped to project can only update project from scoped project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s and project %s is unauthorized to update project", acc.Type, acc.WorkspaceKey, acc.ProjectKey))
		cancel()
	}
	// otherwise
	// * update any project if root

	r, err := s.ProjectRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
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

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return &e
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessService.String() || acc.Type == rsc.AccessUser.String() {
		// service can not delete project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is unauthorized to delete project", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != a.WorkspaceKey.String() {
		// admin scoped to workspace can only delete project from scoped workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is unauthorized to delete project", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type != rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() && (acc.WorkspaceKey != a.WorkspaceKey.String() || acc.ProjectKey != a.ProjectKey.String()) {
		// admin scoped to project can only delete scoped project
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s and project %s is unauthorized to delete project", acc.Type, acc.WorkspaceKey, acc.ProjectKey))
		cancel()
	}
	// otherwise
	// * delete any project if root

	if err := s.ProjectRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
