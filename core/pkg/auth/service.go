package auth

import (
	"core/internal/policy"
	rsc "core/internal/resource"
	"errors"
	"fmt"
)

// Authorize checks if an access token is of a desired type
func Authorize(
	atk rsc.Token,
	accessType rsc.AccessType,
) error {
	a, err := getAccessFromToken(atk)
	if err != nil {
		return err
	}

	if a.Type != accessType.String() {
		return fmt.Errorf(
			"You need %s access in order to conduct this operation",
			accessType,
		)
	}

	return nil
}

// Enforce enforces a resource policy
func Enforce(
	atk rsc.Token,
	resourceID rsc.ID,
	accessType rsc.AccessType,
) error {
	a, err := getAccessFromToken(atk)
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
	a, err := getAccessFromToken(atk)
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
