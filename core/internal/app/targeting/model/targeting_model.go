package model

import (
	"core/pkg/flagset"
)

// Targeting represents a targeting configuration for a flag in a particular environment
type Targeting struct {
	ID                    string              `json:"id"`
	Enabled               bool                `json:"enabled"`
	FallthroughVariations []flagset.Variation `json:"fallthroughVariations,omitempty"`
}
