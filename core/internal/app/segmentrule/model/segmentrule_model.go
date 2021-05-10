package model

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/flagset"
)

// SegmentRule represents a condition used to filter identities for a particular segment
type SegmentRule struct {
	ID         rsc.ID           `json:"id"`
	Key        rsc.Key          `json:"key"`
	TraitKey   string           `json:"traitKey"`
	TraitValue string           `json:"traitValue"`
	Operator   flagset.Operator `json:"operator"`
	Negate     bool             `json:"negate"`
}
