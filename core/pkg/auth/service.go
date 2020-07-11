package auth

import (
	"core/internal/jwt"
	"core/internal/policy"
	rsc "core/internal/resource"
	"core/pkg/access"
	"encoding/json"
	"errors"
)

// Enforce algorithm
// 1. Decode JWT & Check if it's not expired
// 2. Enforce policy
// Return (access, ErrorResponse)
//
// Enforce is used to validate a policy
func Enforce(
	atk rsc.Token,
	resourceID rsc.ID,
	accessType rsc.AccessType,
) error {
	a, err := GetAccessFromToken(atk)
	if err != nil {
		return err
	}

	// enforce policy
	ok, err := policy.Enforce(a.ID, resourceID, accessType)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("Insufficient permission")
	}

	return nil
}

// AddPolicy add casbin policy
func AddPolicy(
	atk rsc.Token,
	resourceID rsc.ID,
	accessType rsc.AccessType,
) error {
	a, err := GetAccessFromToken(atk)
	if err != nil {
		return err
	}

	ok, err := policy.AddPolicy(a.ID, resourceID, accessType)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("Unable to add policy")
	}

	return nil
}

// GetAccessFromToken retrieves access from access token (atk)
func GetAccessFromToken(atk rsc.Token) (*access.Access, error) {
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
