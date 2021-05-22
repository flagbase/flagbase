package model

import rsc "core/internal/pkg/resource"

// Segment represents a group of identities with similar characteristics.
type Segment struct {
	ID          string          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}
