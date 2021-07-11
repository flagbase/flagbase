package model

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/model"
)

// TargetingRule represents a condition which when satisfied outputs the variation during evaluation.
type TargetingRule struct {
	ID             string             `json:"id" jsonapi:"primary,targeting_rule"`
	Key            rsc.Key            `json:"key" jsonapi:"attr,key"`
	Name           rsc.Name           `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description    rsc.Description    `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags           rsc.Tags           `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
	Type           string             `json:"type" jsonapi:"attr,type"`
	TraitKey       string             `json:"traitKey,omitempty" jsonapi:"attr,traitKey,omitempty"`
	TraitValue     string             `json:"traitValue,omitempty" jsonapi:"attr,traitValue,omitempty"`
	Operator       model.Operator     `json:"operator,omitempty" jsonapi:"attr,operator,omitempty"`
	Negate         bool               `json:"negate,omitempty" jsonapi:"attr,negate,omitempty"`
	RuleVariations []*model.Variation `json:"ruleVariations" jsonapi:"attr,ruleVariations"`
	IdentityKey    rsc.Key            `json:"identityKey,omitempty" jsonapi:"attr,identityKey,omitempty"`
	SegmentKey     rsc.Key            `json:"segmentKey,omitempty" jsonapi:"attr,segmentKey,omitempty"`
}
