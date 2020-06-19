package auth

import (
	"core/internal/response"
	"core/internal/constants"
	"core/internal/jwt"
	"core/internal/policy"
	"core/pkg/access"

	"github.com/sirupsen/logrus"
)

// Enforce algorithm
// 1. Decode JWT & Check if it's not expired
// 2. Enforce policy
// Return (access, ErrorResponse)
//
// Enforce is used to validate a policy
func Enforce(
	atk string,
	resourceType string,
	resourceKey string,
	accessType string,
) (*response.Access, *response.Errors) {
	var e response.Errors

	a, err := getAccessFromToken(atk)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	resourceID := getResourceID(resourceType, resourceKey)

	// enforce policy
	ok, err := policy.Enforce(a.ID, resourceID, accessType)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
		)
	}

	if ok != true {
		e.Append(constants.AuthError, "unable to enforce policy using this access token")
	}

	return a, &e
}

func getAccessFromToken(atk string) (*access.Access, error) {
	a, err := jwt.Verify(atk)
	if err != nil {
		return nil, err
	}

	return a, nil
}

func getResourceID(resourceType string, resourceKey string) string {
	return "test"
}
