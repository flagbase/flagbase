package policy

import (
	rsc "core/internal/pkg/resource"

	"github.com/casbin/casbin/v2"
)

// Contract consist of policy identifiers
type Contract struct {
	AccessID     string
	ResourceID   string
	ResourceType rsc.Type
	AccessType   rsc.AccessType
}

// EnforcePolicyFactory return a function that enforces a casbin policy using a policy contract
func EnforcePolicyFactory(
	enf *casbin.Enforcer,
) func(cfg Contract) (bool, error) {
	return func(cfg Contract) (bool, error) {
		return enf.Enforce(
			cfg.AccessID,
			cfg.ResourceID,
			cfg.ResourceType.String(),
			cfg.AccessType.String(),
		)
	}
}

// AddPolicyFactory return a function that add new casbin policy using a policy contract
func AddPolicyFactory(
	enf *casbin.Enforcer,
) func(cfg Contract) (bool, error) {
	return func(cfg Contract) (bool, error) {
		return enf.AddPolicy(
			cfg.AccessID,
			cfg.ResourceID,
			cfg.ResourceType.String(),
			cfg.AccessType.String(),
		)
	}
}
