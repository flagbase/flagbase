package service

import (
	"context"
	accessmodel "core/internal/app/access/model"
	accessrepo "core/internal/app/access/repository"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/jwt"
	"core/internal/pkg/srvenv"
	"core/pkg/crypto"
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

// Create creates new access resource.
func (s *Service) Create(senv *srvenv.Env, i accessmodel.Access) (
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
