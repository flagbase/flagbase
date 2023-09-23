package model

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/model"
)

// SegmentRule represents a condition used to filter identities for a particular segment
type SegmentRule struct {
	ID         				string         	`json:"id" jsonapi:"primary,segment_rule"`
	Key        				rsc.Key        	`json:"key" jsonapi:"attr,key"`
	TraitKey   				string         	`json:"traitKey" jsonapi:"attr,traitKey"`
	TraitValue 				string         	`json:"traitValue" jsonapi:"attr,traitValue"`
	Operator   				model.Operator 	`json:"operator" jsonapi:"attr,operator"`
	Negate     				bool           	`json:"negate" jsonapi:"attr,negate"`
	Enabled		   			bool           	`json:"enabled,omitempty" jsonapi:"attr,enabled,omitempty"`
	EffectiveStartTimestamp	int				`json:"effectiveStartTimestamp,omitempty" jsonapi:"attr,effectiveStartTimestamp,omitempty"`
	EffectiveEndTimestamp	int				`json:"effectiveEndTimestamp,omitempty" jsonapi:"attr,effectiveEndTimestamp,omitempty"`
	Order					int 			`json:"order,omitempty" jsonapi:"attr,order,omitempty"`
}
