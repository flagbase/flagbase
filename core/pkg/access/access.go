package access

import (
	"context"
	"core/generated/models"
	"core/internal/codes"
	"core/internal/crypto"
	"core/internal/db"
	"core/internal/rand"
	"core/internal/time"

	"github.com/google/uuid"
	"github.com/lib/pq"
)

// CreateAccess create a new access key-secret pair.
func CreateAccess(i models.AccessInput) (
	*models.SuccessResponse,
	*models.ErrorResponse,
) {
	ctx := context.Background()
	var e models.ErrorResponse
	var a models.Access

	key := uuid.New().String() // generate a key
	a.Secret = rand.String(30) // generate a secret
	encryptedSecret, err := crypto.Encrypt(a.Secret)
	if err != nil {
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    codes.CryptoError,
				Message: err.Error(),
			},
		)
	}

	// default values
	if i.ExpiresAt == 0 {
		i.ExpiresAt = time.MaxUnixTime
	}
	if i.Type == nil {
		*i.Type = models.AccessInputTypeService
	}
	if i.Tags == nil {
		i.Tags = []string{}
	}

	row := db.Pool.QueryRow(ctx, `
  INSERT INTO access
    (key, encrypted_secret, type, expires_at, name, description, tags)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7)
  RETURNING
    key, type, expires_at, name, description, tags;`,
		key,
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
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    codes.InvalidInput,
				Message: err.Error(),
			},
		)
	}

	return &models.SuccessResponse{Data: a}, &e
}
