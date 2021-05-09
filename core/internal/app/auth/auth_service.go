package auth

import (
	srv "core/internal/infra/server"
	"core/internal/pkg/httputil"
	"core/internal/pkg/policy"
	rsc "core/internal/pkg/resource"
	"errors"
	"fmt"
	"reflect"
)

// Authorize checks if an access token is of a desired type
func Authorize(
	sctx *srv.Ctx,
	atk rsc.Token,
	accessType rsc.AccessType,
) error {
	// bypass auth for internal operations using secure runtime hash
	if reflect.DeepEqual(
		atk,
		httputil.SecureOverideATK(sctx),
	) {
		return nil
	}

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
	sctx *srv.Ctx,
	atk rsc.Token,
	resourceID rsc.ID,
	resourceType rsc.Type,
	accessType rsc.AccessType,
) error {
	// bypass auth for internal operations using secure runtime hash
	if reflect.DeepEqual(
		atk,
		httputil.SecureOverideATK(sctx),
	) {
		return nil
	}

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

// AddPolicy add casbin policy for a given resource
func AddPolicy(
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
