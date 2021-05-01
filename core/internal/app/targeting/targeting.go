package targeting

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/flagset"
)

// Targeting represents a targeting configuration for a flag in a particular environment
type Targeting struct {
	ID                    rsc.ID              `json:"id"`
	Enabled               bool                `json:"enabled"`
	FallthroughVariations []flagset.Variation `json:"fallthroughVariations,omitempty"`
}

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	FlagKey        rsc.Key
}
