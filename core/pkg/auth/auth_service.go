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

	// Check access based priority
	// Root > Admin > User > Service
	if rsc.AccessTypeFromString[a.Type] < accessType {
		return fmt.Errorf(
			"need %s access role (or greater) to conduct this operation",
			accessType,
		)
	}

	return nil
}

// Enforce enforces a resource policy
func Enforce(
	atk rsc.Token,
	resourceID rsc.ID,
	resourceType rsc.Type,
	accessType rsc.AccessType,
) error {
	a, err := getAccessFromToken(atk)
	if err != nil {
		return err
	}

	// enforce policy
	ok, err := policy.Enforce(a.ID, resourceID, resourceType, accessType)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("insufficient permission")
	}

	return nil
}

// AddPolicy add casbin policy for a given resource
func AddPolicy(
	atk rsc.Token,
	resourceID rsc.ID,
	resourceType rsc.Type,
	accessType rsc.AccessType,
) error {
	a, err := getAccessFromToken(atk)
	if err != nil {
		return err
	}

	ok, err := policy.AddPolicy(a.ID, resourceID, resourceType, accessType)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("unable to add policy")
	}

	return nil
}
