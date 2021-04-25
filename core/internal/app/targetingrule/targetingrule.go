package targetingrule

import (
	"core/internal/app/ruleoperand"
	rsc "core/internal/pkg/resource"
)

// TargetingRule represents a condition which when satisfied outputs the variation during evaluation.
type TargetingRule struct {
	ID             rsc.ID               `json:"id"`
	Key            rsc.Key              `json:"key"`
	Name           rsc.Name             `json:"name,omitempty"`
	Description    rsc.Description      `json:"description,omitempty"`
	Tags           rsc.Tags             `json:"tags,omitempty"`
	Type           string               `json:"type"`
	TraitKey       string               `json:"traitKey"`
	TraitValue     string               `json:"traitValue"`
	Operator       ruleoperand.Operator `json:"operator"`
	Negate         bool                 `json:"negate"`
	RuleVariations []RuleVariation      `json:"ruleVariations"`
}

type RuleVariation struct {
	VariationKey rsc.Key
	Weight       int8
}

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	FlagKey        rsc.Key
}

// ResourceArgs arguments for selecting specific resource
type ResourceArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	FlagKey        rsc.Key
	RuleKey        rsc.Key
}