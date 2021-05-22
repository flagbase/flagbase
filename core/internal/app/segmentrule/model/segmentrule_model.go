package model

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/flagset"
)

// SegmentRule represents a condition used to filter identities for a particular segment
type SegmentRule struct {
	ID         string           `json:"id" jsonapi:"primary,segment_rule"`
	Key        rsc.Key          `json:"key" jsonapi:"attr,key"`
	TraitKey   string           `json:"traitKey" jsonapi:"attr,traitKey"`
	TraitValue string           `json:"traitValue" jsonapi:"attr,traitValue"`
	Operator   flagset.Operator `json:"operator" jsonapi:"attr,operator"`
	Negate     bool             `json:"negate" jsonapi:"attr,negate"`
}
