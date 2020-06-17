package access

import (
	"context"
	"core/generated/models"
	"core/internal/constants"
	"core/internal/crypto"
	"core/internal/db"
	"core/internal/enforce"

	"core/pkg/auth"

	"github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

// CreateAccess create a new access key-secret pair.
func CreateAccess(atk string, i models.Access) (
	*models.SuccessResponse,
	*models.ErrorResponse,
) {
	ctx := context.Background()
	var e models.ErrorResponse
	var a models.Access

	parentAccessID, authError := auth.Enforce(atk, "access", i.Key, i.Type)
	if authError.Errors != nil {
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: "forbidden operation",
			},
		)
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
	row := db.Pool.QueryRow(ctx, `
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
	if parentAccessID == constants.RuntimeToken {
		parentAccessID = accessID
	}

	// Create new enforcer policy
	enforce.Enforcer.AddPolicy(parentAccessID, accessID, a.Type)

	// display unencrypted secret one time upon creation
	a.Secret = i.Secret

	return &models.SuccessResponse{Data: a}, &e
}
