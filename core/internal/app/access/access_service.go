package access

import (
	"context"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/jwt"
	"core/internal/pkg/srvenv"
	"core/pkg/crypto"
	res "core/pkg/response"
	"encoding/json"
)

// GenerateToken generate an access token via an access pair
func GenerateToken(senv *srvenv.Env, i KeySecretPair) (
	*Token,
	*res.Errors,
) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := getResource(ctx, senv, KeySecretPair{Key: i.Key, Secret: "******"})
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

	return &Token{
		Token:  atk,
		Access: r,
	}, &e
}

// Create creates new access resource.
func Create(senv *srvenv.Env, i Access) (
	*Access,
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

	r, err := createResource(ctx, senv, i)
	if err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// display un-encrypted secret one time upon creation
	r.Secret = originalSecret

	return r, &e
}
