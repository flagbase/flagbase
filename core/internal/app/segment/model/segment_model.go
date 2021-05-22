package model

import rsc "core/internal/pkg/resource"

// Segment represents a group of identities with similar characteristics.
type Segment struct {
	ID          string          `json:"id" jsonapi:"primary,segment"`
	Key         rsc.Key         `json:"key" jsonapi:"attr,key"`
	Name        rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
}
