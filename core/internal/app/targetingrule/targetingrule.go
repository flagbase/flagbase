package targetingrule

import (
	rsc "core/internal/pkg/resource"
	"core/pkg/flagset"
)

// TargetingRule represents a condition which when satisfied outputs the variation during evaluation.
type TargetingRule struct {
	ID             rsc.ID              `json:"id"`
	Key            rsc.Key             `json:"key"`
	Name           rsc.Name            `json:"name,omitempty"`
	Description    rsc.Description     `json:"description,omitempty"`
	Tags           rsc.Tags            `json:"tags,omitempty"`
	Type           string              `json:"type"`
	TraitKey       string              `json:"traitKey,omitempty"`
	TraitValue     string              `json:"traitValue,omitempty"`
	Operator       flagset.Operator    `json:"operator,omitempty"`
	Negate         bool                `json:"negate,omitempty"`
	RuleVariations []flagset.Variation `json:"ruleVariations"`
	IdentityKey    rsc.Key             `json:"identityKey,omitempty"`
	SegmentKey     rsc.Key             `json:"segmentKey,omitempty"`
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
