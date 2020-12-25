package flag

import rsc "core/internal/resource"

// Flag (aka feature flag) consists of a set of variations and represents the state of a feature in a project.
type Flag struct {
	ID          rsc.ID          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}
