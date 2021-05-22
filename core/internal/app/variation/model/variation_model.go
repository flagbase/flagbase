package model

import rsc "core/internal/pkg/resource"

// Variation represents a unique state of a feature flag.
type Variation struct {
	ID          string          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}
