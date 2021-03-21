package policy

import (
	rsc "core/internal/pkg/resource"

	pgadapter "github.com/casbin/casbin-pg-adapter"
	"github.com/casbin/casbin/v2"
)

var (
	// Enforcer global casbin enforcer object
	Enforcer *casbin.Enforcer
)

// NewEnforcer postgresql connection pool
func NewEnforcer(connStr string) error {
	adapter, err := pgadapter.NewAdapter(connStr)
	if err != nil {
		return err
	}

	model := NewModel()

	enforcer, err := casbin.NewEnforcer(
		model,
		adapter,
	)
	if err != nil {
		return err
	}

	Enforcer = enforcer

	if err := Enforcer.LoadPolicy(); err != nil {
		return err
	}

	return nil
}

// Enforce enforces a casbin policy
func Enforce(
	accessID rsc.ID,
	resourceID rsc.ID,
	resourceType rsc.Type,
	accessType rsc.AccessType,
) (bool, error) {
	return Enforcer.Enforce(
		accessID.String(),
		resourceID.String(),
		resourceType.String(),
		accessType.String(),
	)
}

// AddPolicy add new casbin policy
func AddPolicy(
	accessID rsc.ID,
	resourceID rsc.ID,
	resourceType rsc.Type,
	accessType rsc.AccessType,
) (bool, error) {
	return Enforcer.AddPolicy(
		accessID.String(),
		resourceID.String(),
		resourceType.String(),
		accessType.String(),
	)
}
