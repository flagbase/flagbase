package auth

import (
	"context"
	"core/generated/models"
	"core/internal/constants"
	"core/internal/db"
	"core/internal/jwt"
	"core/internal/policy"
	"errors"
	"fmt"

	"github.com/sirupsen/logrus"
)

// Enforce algorithm
// 1. Decode JWT & Check if it's not expired
// 2. Enforce policy
// Return (accessId, ErrorResponse)
//
// Enforce is used to validate a policy
func Enforce(
	atk string,
	resourceType string,
	resourceKey string,
	accessType string,
) (*models.Access, *models.ErrorResponse) {
	var e models.ErrorResponse

	// Skip auth if using runtime token, which is used for
	// creating the genesis access key-secret (i.e. root)
	if atk == constants.RuntimeToken {
		return nil, &e
	}

	a, err := getAccessFromToken(atk)
	if err != nil {
		logrus.Error(err.Error())
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: err.Error(),
			},
		)
	}

	resourceID := getResourceID(resourceType, resourceKey)
	fmt.Println(a.ID, resourceID, a.Type)
	ok, err := policy.Enforce(a.ID, resourceID, a.Type)
	if err != nil {
		logrus.Error(err.Error())
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: err.Error(),
			},
		)
	}

	if ok != true {
		logrus.WithFields(logrus.Fields{
			"accessToken":  atk,
			"resourceType": resourceType,
			"resourceKey":  resourceKey,
			"accessType":   accessType,
		}).Error("insufficient permissions resource action")
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: "insufficient permissions resource action",
			},
		)
	}

	return a, &e
}

func getAccessFromToken(atk string) (*models.Access, error) {
	ID, err := jwt.Verify(atk)
	if err != nil {
		return nil, err
	}

	var a models.Access
	row := db.Pool.QueryRow(context.Background(), `
	SELECT
	  id, key, name, description, tags, expires_at, type
	FROM
	  access
	WHERE
	  id = $1
	`, ID)
	if err := row.Scan(&a.ID, &a.Key, &a.Name, &a.Description, &a.Tags, &a.ExpiresAt, &a.Type); err != nil {
		return nil, errors.New("unable to find access key")
	}

	return &a, nil
}

func getResourceID(resourceType string, resourceKey string) string {
	return "test"
}
