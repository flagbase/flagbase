package policy

import (
	"github.com/casbin/casbin/v2"
)

// Policy casbin interface
type Policy struct {
	Enforcer      *casbin.Enforcer
	EnforcePolicy func(cfg Contract) (bool, error)
	AddPolicy     func(cfg Contract) (bool, error)
}
