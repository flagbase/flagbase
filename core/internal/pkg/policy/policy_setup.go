package policy

import (
	pgadapter "github.com/casbin/casbin-pg-adapter"
	"github.com/casbin/casbin/v2"
)

// Config policy setup configuration
type Config struct {
	PGConnStr string
}

// Setup init casbin policy interface
func Setup(cfg Config) (*Policy, error) {
	adapter, err := pgadapter.NewAdapter(cfg.PGConnStr)
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
