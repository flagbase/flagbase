package workspace

import "core/internal/resource"

// Workspace represents a collection of projects
type Workspace struct {
	ID          resource.ID          `json:"id"`
	Key         resource.Key         `json:"key"`
	Name        resource.Name        `json:"name,omitempty"`
	Description resource.Description `json:"description,omitempty"`
	Tags        resource.Tags        `json:"tags,omitempty"`
}
