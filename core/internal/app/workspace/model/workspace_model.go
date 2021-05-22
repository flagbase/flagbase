package model

import rsc "core/internal/pkg/resource"

// Workspace represents a collection of projects
type Workspace struct {
	ID          string          `jsonapi:"primary,workspace"`
	Key         rsc.Key         `jsonapi:"attr,key"`
	Name        rsc.Name        `jsonapi:"attr,name,omitempty"`
	Description rsc.Description `jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `jsonapi:"attr,tags,omitempty"`
}
