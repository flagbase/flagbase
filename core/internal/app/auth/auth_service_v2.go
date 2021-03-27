package auth

import (
	"core/internal/pkg/policy"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"errors"
	"fmt"
)

// AuthorizeV2 checks if an access token is of a desired type
func AuthorizeV2(
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

// EnforceV2 enforces a resource policy
func EnforceV2(
	sctx *srv.Ctx,
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
	ok, err := sctx.Policy.EnforcePolicy(
		policy.Contract{
			AccessID:     a.ID,
			ResourceID:   resourceID,
			ResourceType: resourceType,
			AccessType:   accessType,
		},
	)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("insufficient permission")
	}

	return nil
}

// AddPolicyV2 add casbin policy for a given resource
func AddPolicyV2(
	sctx *srv.Ctx,
	atk rsc.Token,
	resourceID rsc.ID,
	resourceType rsc.Type,
	accessType rsc.AccessType,
) error {
	a, err := getAccessFromToken(atk)
	if err != nil {
		return err
	}

	ok, err := sctx.Policy.AddPolicy(
		policy.Contract{
			AccessID:     a.ID,
			ResourceID:   resourceID,
			ResourceType: resourceType,
			AccessType:   accessType,
		},
	)
	if err != nil {
		return err
	}
	if !ok {
		return errors.New("unable to add policy")
	}

	return nil
}
