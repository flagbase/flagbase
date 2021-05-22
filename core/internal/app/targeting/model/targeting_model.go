package model

import (
	"core/pkg/flagset"
)

// Targeting represents a targeting configuration for a flag in a particular environment
type Targeting struct {
	ID                    string              `json:"id" jsonapi:"primary,targeting"`
	Enabled               bool                `json:"enabled" jsonapi:"attr,enabled"`
	FallthroughVariations []flagset.Variation `json:"fallthroughVariations,omitempty" jsonapi:"attr,fallthroughVariations,omitempty"`
}
