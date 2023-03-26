package service

import (
	"context"
	workspacemodel "core/internal/app/workspace/model"
	workspacerepo "core/internal/app/workspace/repository"
	"core/internal/pkg/authv2"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
	"fmt"
)

type Service struct {
	Senv          *srvenv.Env
	WorkspaceRepo *workspacerepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:          senv,
		WorkspaceRepo: workspacerepo.NewRepo(senv),
	}
}

// List returns a list of resource instances
// (*) atk: access_type <= root
func (s *Service) List(
	atk rsc.Token,
	a workspacemodel.RootArgs,
) ([]*workspacemodel.Workspace, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.WorkspaceRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// Enforce access requirements
	if acc.Type != rsc.AccessRoot.String() {
		// only list scoped workspaces
		for _, _r := range r {
			if _r.Key.String() != acc.WorkspaceKey {
				_r.ID = "redacted"
			}
		}
	}
	// otherwise
	// * root should see all workspaces

	// Filter eligible items
	filtered := make([]*workspacemodel.Workspace, 0)
	for _, _r := range r {
		if _r.ID != "redacted" {
			filtered = append(filtered, _r)
		}
	}

	return filtered, &e
}

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= root
func (s *Service) Create(
	atk rsc.Token,
	i workspacemodel.Workspace,
	a workspacemodel.RootArgs,
) (*workspacemodel.Workspace, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	if acc.Type != rsc.AccessRoot.String() {
		// root is only allowed to a create workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not allowed to create a workspace", acc.Type))
		cancel()
	}

	r, err := s.WorkspaceRepo.Create(ctx, i, a)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	return r, &e
}

// Get gets a resource instance given an atk & workspaceKey
// (*) atk: access_type <= service
func (s *Service) Get(
	atk rsc.Token,
	a workspacemodel.ResourceArgs,
) (*workspacemodel.Workspace, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	// Enforce access requirements
	if acc.Type != rsc.AccessRoot.String() && a.WorkspaceKey.String() != acc.WorkspaceKey {
		// all access types are scoped to a workspace, unless it's root
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is not allowed to retrieve workspaces outside its scope", acc.Type, acc.WorkspaceKey))
		cancel()
	}
	// otherwise
	// * show if root with instance scope

	r, err := s.WorkspaceRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
}

// Update updates resource instance given an atk, workspaceKey & patch object
// (*) atk: access_type <= user
func (s *Service) Update(
	atk rsc.Token,
	patchDoc patch.Patch,
	a workspacemodel.ResourceArgs,
) (*workspacemodel.Workspace, *res.Errors) {
	var o workspacemodel.Workspace
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	// Enforce access requirements
	if acc.Type != rsc.AccessRoot.String() && a.WorkspaceKey.String() != acc.WorkspaceKey {
		// all access types are scoped to a workspace, unless it's root
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is not allowed to update workspaces outside its scope", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type == rsc.AccessUser.String() || acc.Type == rsc.AccessService.String() {
		// user and service access are not allowed to update the workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not allowed to update workspaces", acc.Type))
		cancel()
	}
	// otherwise
	// * update if root with instance scope

	r, err := s.WorkspaceRepo.Get(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	r, err = s.WorkspaceRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return r, &e
}

// Delete deletes a resource instance given an atk & workspaceKey
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a workspacemodel.ResourceArgs,
) *res.Errors {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authv2.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return &e
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != a.WorkspaceKey.String() {
		// admin access scoped to a workspace, is not allowed to delete workspace outside its scope
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is not allowed to delete workspaces outside its scope", acc.Type, acc.WorkspaceKey))
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() {
		// admin access scoped to project, is not allowed to delete any workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to project %s is unauthorized to delete workspace", acc.Type, acc.ProjectKey))
	} else if acc.Type == rsc.AccessUser.String() || acc.Type == rsc.AccessService.String() {
		// user and service access are not allowed to update the workspace
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not allowed to delete workspaces", acc.Type))
		cancel()
	}
	// otherwise
	// * update if root with instance scope

	if err := s.WorkspaceRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
