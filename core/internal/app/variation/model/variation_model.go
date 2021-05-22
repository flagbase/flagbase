package model

import rsc "core/internal/pkg/resource"

// Variation represents a unique state of a feature flag.
type Variation struct {
	ID          string          `json:"id" jsonapi:"primary,variation"`
	Key         rsc.Key         `json:"key" jsonapi:"attr,key"`
	Name        rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
}
