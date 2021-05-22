package model

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/flagset"
)

// TargetingRule represents a condition which when satisfied outputs the variation during evaluation.
type TargetingRule struct {
	ID             string              `jsonapi:"primary,targeting_rule"`
	Key            rsc.Key             `jsonapi:"attr,key"`
	Name           rsc.Name            `jsonapi:"attr,name,omitempty"`
	Description    rsc.Description     `jsonapi:"attr,description,omitempty"`
	Tags           rsc.Tags            `jsonapi:"attr,tags,omitempty"`
	Type           string              `jsonapi:"attr,type"`
	TraitKey       string              `jsonapi:"attr,traitKey,omitempty"`
	TraitValue     string              `jsonapi:"attr,traitValue,omitempty"`
	Operator       flagset.Operator    `jsonapi:"attr,operator,omitempty"`
	Negate         bool                `jsonapi:"attr,negate,omitempty"`
	RuleVariations []flagset.Variation `jsonapi:"attr,ruleVariations"`
	IdentityKey    rsc.Key             `jsonapi:"attr,identityKey,omitempty"`
	SegmentKey     rsc.Key             `jsonapi:"attr,segmentKey,omitempty"`
}
