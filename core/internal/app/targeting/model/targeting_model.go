package model

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
