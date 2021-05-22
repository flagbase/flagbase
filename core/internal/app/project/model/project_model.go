package model

import rsc "core/internal/pkg/resource"

// Project represents a collection of feature flags
// in their corresponding environments
type Project struct {
	ID          string          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}
