package access

import (
	"context"
	"core/generated/models"
	"core/internal/constants"
	"core/internal/crypto"
	"core/internal/db"
	"core/internal/jwt"
	"core/internal/policy"

	"core/pkg/auth"

	"github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

// CreateAccess create a new access key-secret pair.
func CreateAccess(atk string, i models.Access) (
	*models.SuccessResponse,
	*models.ErrorResponse,
) {
	var e models.ErrorResponse
	var a models.Access

	// TODO: think about user paradox (draw up workflow)
	// Make sure only root can create new admin users
	parentAccess, authErr := auth.Enforce(atk, "access", i.Key, i.Type)
	if authErr.Errors != nil {
		e.Errors = append(
			e.Errors,
			authErr.Errors...,
		)
		// TODO: Remove early exit and use context to cancel operations
		return nil, &e
	}

	// encrypt secret
	encryptedSecret, err := crypto.Encrypt(i.Secret)
	if err != nil {
		logrus.Error("Unable to encrypt secret - ", err.Error())
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.CryptoError,
				Message: err.Error(),
			},
		)
	}

	var accessID string
	row := db.Pool.QueryRow(context.Background(), `
  INSERT INTO access
    (key, encrypted_secret, type, expires_at, name, description, tags)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7)
  RETURNING
    id, key, type, expires_at, name, description, tags;`,
		i.Key,
		encryptedSecret,
		i.Type,
		i.ExpiresAt,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	)
	if err := row.Scan(
		&accessID,
		&a.Key,
		&a.Type,
		&a.ExpiresAt,
		&a.Name,
		&a.Description,
		&a.Tags,
	); err != nil {
		logrus.Error("Unable to create access - ", err.Error())
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.InputError,
				Message: err.Error(),
			},
		)
	}

	// overide parent access id to self if using RuntimeToken
	if atk == constants.RuntimeToken {
		parentAccess.ID = accessID
	}

	// Create new enforcer policy
	policy.Enforcer.AddPolicy(parentAccess.ID, accessID, a.Type)

	// display unencrypted secret one time upon creation
	a.Secret = i.Secret

	return &models.SuccessResponse{Data: a}, &e
}

// GenAccessToken generate an access token via an access pair
func GenAccessToken(i models.AccessPairInput) (
	*models.SuccessResponse,
	*models.ErrorResponse,
) {
	var e models.ErrorResponse

	var accessKeyID string
	var encryptedSecret string
	row := db.Pool.QueryRow(context.Background(), `
	SELECT
	  id, encrypted_secret
	FROM
	  access
	WHERE
	  key = $1
	`, i.Key)
	if err := row.Scan(&accessKeyID, &encryptedSecret); err != nil {
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: "Can not find access secret-key pair",
			},
		)
	}

	if err := crypto.Compare(encryptedSecret, i.Secret); err != nil {
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: "Mismatching access key-secret pair",
			},
		)
	}

	tokenString, err := jwt.Sign(accessKeyID)
	if err != nil {
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: "Unable to sign JWT",
			},
		)
	}

	return &models.SuccessResponse{
		Data: &models.AccessToken{
			Token: tokenString,
		},
	}, &e
}
