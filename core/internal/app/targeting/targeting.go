package targeting

import rsc "core/internal/pkg/resource"

// Targeting represents a targeting configuration for a flag in a particular environment
type Targeting struct {
	ID                    rsc.ID                 `json:"id"`
	Enabled               bool                   `json:"enabled"`
	FallthroughVariations []FallthroughVariation `json:"fallthroughVariations,omitempty"`
}

// FallthroughVariation represents the fallthrough variation for a particular targeting configuration
type FallthroughVariation struct {
	VariationKey rsc.Key `json:"variationKey"`
	Weight       int8    `json:"weight"`
}

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	FlagKey        rsc.Key
}
