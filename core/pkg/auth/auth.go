package auth

import (
	"core/generated/models"
	"core/internal/constants"
	"core/internal/enforce"

	"github.com/sirupsen/logrus"
)

// Enforce is used to enforce valid policy
func Enforce(
	accessToken string,
	resourceType string,
	resourceKey string,
	accessType string,
) (string, *models.ErrorResponse) {
	var e models.ErrorResponse

	// skip auth if using runtime token
	// used when creating genesis access
	if accessToken == constants.RuntimeToken {
		return accessToken, &e
	}

	sub := getAccessIDFromToken(accessToken)
	obj := getResourceID(resourceType, resourceKey)
	act := accessType

	ok, err := enforce.Enforcer.Enforce(sub, obj, act)
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
			"accessToken":  accessToken,
			"resourceType": resourceType,
			"resourceKey":  resourceKey,
			"accessType":   accessType,
		}).Error("Access denied - insufficient permissions resource action.")
		e.Errors = append(
			e.Errors,
			&models.Error{
				Code:    constants.AuthError,
				Message: "Access denied - insufficient permissions resource action.",
			},
		)
	}

	return sub, &e
}

func getAccessIDFromToken(accessToken string) string {
	return "test"
}
func getResourceID(resourceType string, resourceKey string) string {
	return "test"
}
