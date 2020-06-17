package enforce

import (
	pgadapter "github.com/casbin/casbin-pg-adapter"
	"github.com/casbin/casbin/v2"
)

var (
	// Enforcer global casbin enforcer
	Enforcer *casbin.Enforcer
)

// NewEnforcer postgresql connection pool
func NewEnforcer(connStr string) error {
	adapter, err := pgadapter.NewAdapter(connStr)
	if err != nil {
		return err
	}

	enforcer, err := casbin.NewEnforcer(
		"./internal/enforce/model.conf",
		adapter,
	)
	if err != nil {
		return err
	}

	Enforcer = enforcer
	Enforcer.LoadPolicy()

	return nil
}
