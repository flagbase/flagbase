package service

import (
	"context"
	accessmodel "core/internal/app/access/model"
	accessrepo "core/internal/app/access/repository"
	"core/internal/pkg/auth"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/jwt"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/crypto"
	"core/pkg/patch"
	res "core/pkg/response"
	"encoding/json"
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

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{Key: i.Key, Secret: "******"})
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
	r.Secret = "**************"

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

	if err := auth.Authorize(s.Senv, atk, rsc.AccessRoot); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	r, err := s.AccessRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	for _, _r := range r {
		_r.Secret = "**************"
	}

	return r, &e
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

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{
		Key: a.AccessKey.String(),
	})
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Workspace,
		rsc.AccessService,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	// hide secret
	r.Secret = "**************"

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

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{Key: a.AccessKey.String()})
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Access,
		rsc.AccessUser,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

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
	r.Secret = "**************"

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

	r, err := s.AccessRepo.Get(ctx, accessmodel.KeySecretPair{Key: a.AccessKey.String()})
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
		cancel()
	}

	if err := auth.Enforce(
		s.Senv,
		atk,
		r.ID,
		rsc.Workspace,
		rsc.AccessAdmin,
	); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	if err := s.AccessRepo.Delete(ctx, a); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
