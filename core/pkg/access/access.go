package access

import (
	"context"
	"core/generated/models"
	"core/internal/codes"
	"core/internal/crypto"
	"core/internal/db"

	"github.com/lib/pq"
	"github.com/sirupsen/logrus"
)

// CreateAccess create a new access key-secret pair.
func CreateAccess(i models.Access) (
	*models.SuccessResponse,
	*models.ErrorResponse,
) {
	ctx := context.Background()
	var e models.ErrorResponse
	var a models.Access

	// encrypt secret
	encryptedSecret, err := crypto.Encrypt(i.Secret)
	if err != nil {
		logrus.Error("Unable to encrypt secret - ", err.Error())
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    codes.CryptoError,
				Message: err.Error(),
			},
		)
	}

	row := db.Pool.QueryRow(ctx, `
  INSERT INTO access
    (key, encrypted_secret, type, expires_at, name, description, tags)
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
		logrus.Error("Unable to create access - ", err.Error())
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    codes.InputError,
				Message: err.Error(),
			},
		)
	}

	// display unencrypted secret one time upon creation
	a.Secret = i.Secret

	return &models.SuccessResponse{Data: a}, &e
}
