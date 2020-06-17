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
) *models.ErrorResponse {
	var e models.ErrorResponse

	sub := getAccessIdFromToken(accessToken)
	obj := getResourceId(resourceType, resourceKey)
	act := accessType

	ok, err := enforce.Enforcer(sub, obj, act)
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

	return e
}
