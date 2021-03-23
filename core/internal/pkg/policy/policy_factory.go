package policy

import (
	rsc "core/internal/pkg/resource"

	"github.com/casbin/casbin/v2"
)

// Contract consist of policy identifiers
type Contract struct {
	accessID     rsc.ID
	resourceID   rsc.ID
	resourceType rsc.Type
	accessType   rsc.AccessType
}

// EnforcePolicyFactory return a function that enforces a casbin policy using a policy contract
func EnforcePolicyFactory(
	enf *casbin.Enforcer,
) func(cnf Contract) (bool, error) {
	return func(cnf Contract) (bool, error) {
		return enf.Enforce(
			cnf.accessID.String(),
			cnf.resourceID.String(),
			cnf.resourceType.String(),
			cnf.accessType.String(),
		)
	}
}

// AddPolicyFactory return a function that add new casbin policy using a policy contract
func AddPolicyFactory(
	enf *casbin.Enforcer,
) func(cnf Contract) (bool, error) {
	return func(cnf Contract) (bool, error) {
		return enf.AddPolicy(
			cnf.accessID.String(),
			cnf.resourceID.String(),
			cnf.resourceType.String(),
			cnf.accessType.String(),
		)
	}
}