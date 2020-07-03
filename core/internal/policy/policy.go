package policy

import (
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
	accessID string,
	resourceID string,
	accessType string,
) (bool, error) {
	return Enforcer.Enforce(
		accessID,
		resourceID,
		accessType,
	)
}
