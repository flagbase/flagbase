package policy

import (
	"github.com/casbin/casbin/v2"
)

// Policy casbin interface
type Policy struct {
	Enforcer      *casbin.Enforcer
	EnforcePolicy func(cnf Contract) (bool, error)
	AddPolicy     func(cnf Contract) (bool, error)
}
