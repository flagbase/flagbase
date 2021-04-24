package segment

import rsc "core/internal/pkg/resource"

// Segment represents a group of identities with similar characteristics.
type Segment struct {
	ID          rsc.ID          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey rsc.Key
	ProjectKey   rsc.Key
}

// ResourceArgs arguments for selecting specific resource
type ResourceArgs struct {
	WorkspaceKey rsc.Key
	ProjectKey   rsc.Key
	SegmentKey   rsc.Key
}
