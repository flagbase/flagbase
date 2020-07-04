package auth

import (
	"core/internal/jwt"
	"core/internal/policy"
	"core/internal/resource"
	"core/pkg/access"
	"encoding/json"
	"errors"

	"github.com/sirupsen/logrus"
)

// Enforce algorithm
// 1. Decode JWT & Check if it's not expired
// 2. Enforce policy
// Return (access, ErrorResponse)
//
// Enforce is used to validate a policy
func Enforce(
	atk resource.Token,
	resourceID resource.ID,
	accessType string,
) error {
	a, err := getAccessFromToken(atk)
	if err != nil {
		return err
	}

	// enforce policy
	ok, err := policy.Enforce(a.ID, resourceID, accessType)
	if err != nil {
		logrus.WithFields(logrus.Fields{
			"accessID":   a.ID,
			"resourceID": resourceID,
			"accessType": accessType,
		}).Info("Unable to enforce policy")
		return err
	}
	if !ok {
		return errors.New("Insufficient permission")
	}

	return nil
}

func getAccessFromToken(atk resource.Token) (*access.Access, error) {
	var a access.Access

	ma, err := jwt.Verify(atk)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(ma, &a); err != nil {
		return nil, err
	}

	return &a, nil
}
