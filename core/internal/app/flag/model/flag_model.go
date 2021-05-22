package model

import rsc "core/internal/pkg/resource"

// Flag (aka feature flag) consists of a set of variations and represents the state of a feature in a project.
type Flag struct {
	ID          string          `json:"id" jsonapi:"primary,flag"`
	Key         rsc.Key         `json:"key" jsonapi:"attr,key"`
	Name        rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
}
