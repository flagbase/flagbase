package access

import (
	"context"
	cons "core/internal/constants"
	"core/internal/crypto"
	"core/internal/db"
	"core/internal/jwt"
	res "core/internal/response"
	"encoding/json"

	"github.com/lib/pq"
)

// GenerateToken generate an access token via an access pair
func GenerateToken(i KeySecretPair) (
	*res.Success,
	*res.Errors,
) {
	var e res.Errors
	var a Access

	var encryptedSecret string
	row := db.Pool.QueryRow(context.Background(), `
	SELECT
	  id, key, type, expires_at, name, description, tags,  encrypted_secret
	FROM
	  access
	WHERE
	  key = $1
	`, i.Key)
	if err := row.Scan(
		&a.ID,
		&a.Key,
		&a.Type,
		&a.ExpiresAt,
		&a.Name,
		&a.Description,
		&a.Tags,
		&encryptedSecret,
	); err != nil {
		e.Append(cons.AuthError, "Can't find access pair")
	}

	if err := crypto.Compare(encryptedSecret, i.Secret); err != nil {
		e.Append(cons.AuthError, "Mismatching access key-secret pair")
	}

	ma, err := json.Marshal(a)
	if err != nil {
		e.Append(cons.InternalError, err.Error())
	}

	atk, err := jwt.Sign(ma)
	if err != nil {
		e.Append(cons.AuthError, "Unable to sign JWT")
	}

	return &res.Success{
		Data: &Token{
			Token:  atk,
			Access: &a,
		},
	}, &e
}

// Create creates new access resource.
func Create(i Access) (
	*res.Success,
	*res.Errors,
) {
	var e res.Errors
	var a Access
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// encrypt secret
	encryptedSecret, err := crypto.Encrypt(i.Secret)
	if err != nil {
		e.Append(cons.CryptoError, err.Error())
		cancel()
	}

	// create root user
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    access(
      key,
      encrypted_secret,
      type,
      expires_at,
      name,
      description,
      tags
    )
  VALUES
    ($1, $2, $3, $4, $5, $6, $7)
  RETURNING
    key, type, expires_at, name, description, tags;`,
		i.Key,
		encryptedSecret,
		i.Type,
		i.ExpiresAt,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	)
	if err := row.Scan(
		&a.Key,
		&a.Type,
		&a.ExpiresAt,
		&a.Name,
		&a.Description,
		&a.Tags,
	); err != nil {
		e.Append(cons.InputError, err.Error())
	}

	// display unencrypted secret one time upon creation
	a.Secret = i.Secret

	return &res.Success{Data: a}, &e
}
