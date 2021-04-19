package workspace

import rsc "core/internal/pkg/resource"

// Workspace represents a collection of projects
type Workspace struct {
	ID          rsc.ID          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}

type RootArgs struct{}

type ResourceArgs struct {
	WorkspaceKey rsc.Key
}
