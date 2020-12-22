package environment

import rsc "core/internal/resource"

// Environment represents a context state for a environment's flagset.
// A project can have many environments.
type Environment struct {
	ID          rsc.ID          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}
