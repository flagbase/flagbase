package model

import "core/pkg/model"

// Targeting represents a targeting configuration for a flag in a particular environment
type Targeting struct {
	ID                    string             `json:"id" jsonapi:"primary,targeting"`
	Enabled               bool               `json:"enabled" jsonapi:"attr,enabled"`
	FallthroughVariations []*model.Variation `json:"fallthroughVariations" jsonapi:"attr,fallthroughVariations"`
}
