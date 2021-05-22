package environment

import rsc "core/internal/pkg/resource"

// Environment represents a context state for a environment's flagset.
// A project can have many environments.
type Environment struct {
	ID          string          `json:"id" jsonapi:"primary,environment"`
	Key         rsc.Key         `json:"key" jsonapi:"attr,key"`
	Name        rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
}
