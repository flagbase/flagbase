package model

import rsc "core/internal/pkg/resource"

// Project represents a collection of feature flags
// in their corresponding environments
type Project struct {
	ID          string          `json:"id" jsonapi:"primary,project"`
	Key         rsc.Key         `json:"key" jsonapi:"attr,key"`
	Name        rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
}
