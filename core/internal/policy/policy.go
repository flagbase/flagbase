package policy

import (
	"core/internal/resource"

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
	Enforcer.LoadPolicy()

	return nil
}

// Enforce enforces a casbin policy
func Enforce(
	accessID resource.ID,
	resourceID resource.ID,
	accessType string,
) (bool, error) {
	return Enforcer.Enforce(
		accessID.String(),
		resourceID.String(),
		accessType,
	)
}

// AddPolicy add new casbin policy
func AddPolicy(
	accessID resource.ID,
	resourceID resource.ID,
	accessType string,
) (bool, error) {
	return Enforcer.AddPolicy(
		accessID.String(),
		resourceID.String(),
		accessType,
	)
}
