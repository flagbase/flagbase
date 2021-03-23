package policy

import (
	rsc "core/internal/pkg/resource"

	pgadapter "github.com/casbin/casbin-pg-adapter"
	"github.com/casbin/casbin/v2"
)

// Contract consist of policy identifiers
type Contract struct {
	accessID     rsc.ID
	resourceID   rsc.ID
	resourceType rsc.Type
	accessType   rsc.AccessType
}

// Policy casbin interface
type Policy struct {
	Enforcer      *casbin.Enforcer
	EnforcePolicy func(cnf Contract) (bool, error)
	AddPolicy     func(cnf Contract) (bool, error)
}

// Config policy setup configuration
type Config struct {
	PGConnStr string
}

// Setup init casbin policy interface
func Setup(cnf Config) (*Policy, error) {
	adapter, err := pgadapter.NewAdapter(cnf.PGConnStr)
	if err != nil {
		return nil, err
	}

	model := NewModel()

	enforcer, err := casbin.NewEnforcer(
		model,
		adapter,
	)
	if err != nil {
		return nil, err
	}

	policy := &Policy{
		Enforcer:      enforcer,
		EnforcePolicy: EnforcePolicyFactory(enforcer),
		AddPolicy:     AddPolicyFactory(enforcer),
	}

	if err := enforcer.LoadPolicy(); err != nil {
		return policy, err
	}

	return policy, err
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
