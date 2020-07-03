package policy

import (
	"github.com/casbin/casbin/v2/model"
)

// NewModel creates a new casbin model
func NewModel() model.Model {
	m := model.NewModel()

	m.AddDef("r", "r", "access_id, resource_id, access_type")
	m.AddDef("p", "p", "access_id, resource_id, access_type")
	m.AddDef("g", "g", "_, _")
	m.AddDef("e", "e", "some(where (p.eft == allow))")

	// Matcher Algo:
	// (not resource specifc) root > admin > user > service
	// (resource specifc)     admin > user > service
	// (resource specifc)     user > service
	m.AddDef("m", "m", "(r.access_id == p.access_id && p.access_type == 'root') || "+
		"(r.access_id == p.access_id && (g(p.resource_id, r.resource_id) || p.resource_id == r.resource_id) && p.access_type == 'admin') || "+
		"(r.access_id == p.access_id && (g(p.resource_id, r.resource_id) || p.resource_id == r.resource_id) && p.access_type == 'user' && r.access_type == 'service') || "+
		"(r.access_id == p.access_id && (g(p.resource_id, r.resource_id) || p.resource_id == r.resource_id) && p.access_type == r.access_type) ",
	)

	return m
}
