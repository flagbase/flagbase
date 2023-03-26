package service

import (
	"context"
	accessmodel "core/internal/app/access/model"
	accessrepo "core/internal/app/access/repository"
	"core/internal/pkg/authutil"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/jwt"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/crypto"
	"core/pkg/patch"
	res "core/pkg/response"
	"encoding/json"
	"fmt"
)

type Service struct {
	Senv       *srvenv.Env
	AccessRepo *accessrepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:       senv,
		AccessRepo: accessrepo.NewRepo(senv),
	}
}

// GenerateToken generate an access token via an access pair
func (s *Service) GenerateToken(i accessmodel.KeySecretPair) (
	*accessmodel.Token,
	*res.Errors,
) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{Key: i.Key, Secret: cons.ServiceHiddenText})
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := crypto.Compare(r.Secret, i.Secret); err != nil {
		e.Append(cons.ErrorAuth, "mismatching access key-secret pair")
	}

	ma, err := json.Marshal(r)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	atk, err := jwt.Sign(ma)
	if err != nil {
		e.Append(cons.ErrorAuth, "unable to sign token")
	}

	// hide secret
	r.Secret = cons.ServiceHiddenText

	return &accessmodel.Token{
		Token:  atk,
		Access: r,
	}, &e
}

// List returns a list of resource instances
// (*) atk: access_type <= root
func (s *Service) List(
	atk rsc.Token,
	a accessmodel.RootArgs,
) ([]*accessmodel.Access, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.AccessRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() {
		// if admin and scoped to workspace
		for _, _r := range r {
			if _r.Scope == rsc.AccessScopeInstance.String() || _r.WorkspaceKey != acc.WorkspaceKey {
				_r.ID = cons.ServiceRedact
			}
		}
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() {
		// if admin and scoped to project
		for _, _r := range r {
			if _r.Scope == rsc.AccessScopeInstance.String() || _r.Scope == rsc.AccessScopeWorkspace.String() || _r.WorkspaceKey != acc.WorkspaceKey || _r.ProjectKey != acc.ProjectKey {
				_r.ID = cons.ServiceRedact
			}
		}
	} else if acc.Type == rsc.AccessUser.String() || acc.Type == rsc.AccessService.String() {
		for _, _r := range r {
			if _r.ID != acc.ID {
				_r.ID = cons.ServiceRedact
			}
		}
	}
	// otherwise
	// * show all if root with instance scope

	// Filter eligible items
	filtered := make([]*accessmodel.Access, 0)
	for _, _r := range r {
		_r.Secret = cons.ServiceHiddenText // hide secrets
		if _r.ID != cons.ServiceRedact {
			filtered = append(filtered, _r)
		}
	}

	return filtered, &e
}

// Create creates new access resource.
func (s *Service) Create(
	atk rsc.Token,
	i accessmodel.Access,
	a accessmodel.RootArgs,
) (
	*accessmodel.Access,
	*res.Errors,
) {
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
		// users/service is not allowed to create access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not allowed to create access", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeInstance.String() {
		// admin is only allowed to create scoped access (workspace or project)
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not allowed to create instance access (must be root access type)", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != i.WorkspaceKey {
		// if admin trying to create scoped workspace access out of their scope
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is not authorised to create access outside own scope", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() && (acc.WorkspaceKey != i.WorkspaceKey || acc.ProjectKey != i.ProjectKey) {
		// if admin trying to create scoped project access out of their scope
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to project %s is not authorised to create access outside own scope", acc.Type, acc.ProjectKey))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Type == rsc.AccessRoot.String() {
		// admin is not allowed to create root access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not authorised to create root access", acc.Type))
		cancel()
	}
	// otherwise
	// * create if root with instance scope

	// Validate scope requirements
	if i.Scope == rsc.AccessScopeProject.String() && (i.WorkspaceKey == "" || i.ProjectKey == "") {
		e.Append(cons.ErrorInput, "Access scoped in project should contain a both a workspace key and a project key")
		cancel()
	} else if i.Scope == rsc.AccessScopeWorkspace.String() && i.WorkspaceKey == "" {
		e.Append(cons.ErrorInput, "Access scoped in workspace should contain a workspace key")
		cancel()
	}

	// Validate type requirements
	if i.Type != rsc.AccessRoot.String() && i.Scope == rsc.AccessScopeInstance.String() {
		e.Append(cons.ErrorInput, "Only root access can be scoped to an instance")
		cancel()
	}

	encryptedSecret, err := crypto.Encrypt(i.Secret)
	if err != nil {
		e.Append(cons.ErrorCrypto, err.Error())
		cancel()
	}

	originalSecret := i.Secret
	i.Secret = encryptedSecret

	r, err := s.AccessRepo.Create(ctx, i)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// display un-encrypted secret one time upon creation
	r.Secret = originalSecret

	return r, &e
}

// Get gets a resource instance given an atk & workspaceKey
// (*) atk: access_type <= service
func (s *Service) Get(
	atk rsc.Token,
	a accessmodel.ResourceArgs,
) (*accessmodel.Access, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{
		Key: a.AccessKey.String(),
	})
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && r.WorkspaceKey != acc.WorkspaceKey {
		// admin access scoped to workspace is only allowed to get scoped access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to a workspace %s is not allowed to retrieve access outside its scope", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() && (r.WorkspaceKey != acc.WorkspaceKey || r.ProjectKey != acc.ProjectKey) {
		// admin access scoped to project is only allowed to get scoped access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to a workspace %s and project %s is not allowed to retrieve access outside its scope", acc.Type, acc.WorkspaceKey, acc.ProjectKey))
		cancel()
	} else if (acc.Type == rsc.AccessUser.String() || acc.Type == rsc.AccessService.String()) && acc.ID != r.ID {
		// user/service access is only allowed to get self
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not authorized to retrieve other access", acc.Type))
		cancel()
	}
	// otherwise
	// * show if root with instance scope

	// hide secret
	r.Secret = cons.ServiceHiddenText

	return r, &e
}

// Update updates resource instance given an atk, workspaceKey & patch object
// (*) atk: access_type <= user
func (s *Service) Update(
	atk rsc.Token,
	patchDoc patch.Patch,
	a accessmodel.ResourceArgs,
) (*accessmodel.Access, *res.Errors) {
	var o accessmodel.Access
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Verify access is authorized
	acc, err := authutil.Authorize(s.Senv, atk)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		return nil, &e
	}

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{Key: a.AccessKey.String()})
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessService.String() {
		// service is not allowed to update access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not authorized to update access", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessUser.String() && acc.ID != r.ID {
		// user is only allowed to update self
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is only authorized to update self", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != r.WorkspaceKey {
		// admin scoped to workspace is only allowed update scoped workspace access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is only authorized to update access scoped in the same workspace", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() && (acc.WorkspaceKey != r.WorkspaceKey || acc.ProjectKey != r.ProjectKey) {
		// admin scoped to workspace is only allowed update scoped workspace access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s and project %s is only authorized to update access scoped in the same workspace and project", acc.Type, acc.WorkspaceKey, acc.ProjectKey))
		cancel()
	}
	// otherwise
	// * update if root with instance scope

	if err := patch.Transform(r, patchDoc, &o); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
		cancel()
	}

	if r.Secret != o.Secret {
		encryptedSecret, err := crypto.Encrypt(o.Secret)
		if err != nil {
			e.Append(cons.ErrorCrypto, err.Error())
			cancel()
		}
		o.Secret = encryptedSecret
	}

	r, err = s.AccessRepo.Update(ctx, o, a)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	// hide secret
	r.Secret = cons.ServiceHiddenText

	return r, &e
}

// Delete deletes a resource instance given an atk & workspaceKey
// (*) atk: access_type <= admin
func (s *Service) Delete(
	atk rsc.Token,
	a accessmodel.ResourceArgs,
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

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{Key: a.AccessKey.String()})
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	// Enforce access requirements
	if acc.Type == rsc.AccessService.String() {
		// service is not allowed to delete access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is not authorized to delete access", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessUser.String() && acc.ID != r.ID {
		// user is only allowed to delete self
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s is only authorized to delete self", acc.Type))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeWorkspace.String() && acc.WorkspaceKey != r.WorkspaceKey {
		// admin scoped to workspace is only allowed delete scoped workspace access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s is only authorized to delete access scoped in the same workspace", acc.Type, acc.WorkspaceKey))
		cancel()
	} else if acc.Type == rsc.AccessAdmin.String() && acc.Scope == rsc.AccessScopeProject.String() && (acc.WorkspaceKey != r.WorkspaceKey || acc.ProjectKey != r.ProjectKey) {
		// admin scoped to workspace is only allowed delete scoped workspace access
		e.Append(cons.ErrorAuth, fmt.Sprintf("Access type %s scoped to workspace %s and project %s is only authorized to delete access scoped in the same workspace and project", acc.Type, acc.WorkspaceKey, acc.ProjectKey))
		cancel()
	}
	// otherwise
	// * delete if root with instance scope

	if err := s.AccessRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
