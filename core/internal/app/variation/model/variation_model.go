package model

import rsc "core/internal/pkg/resource"

// Variation represents a unique state of a feature flag.
type Variation struct {
	ID          string          `jsonapi:"primary,variation"`
	Key         rsc.Key         `jsonapi:"attr,key"`
	Name        rsc.Name        `jsonapi:"attr,name,omitempty"`
	Description rsc.Description `jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `jsonapi:"attr,tags,omitempty"`
}
