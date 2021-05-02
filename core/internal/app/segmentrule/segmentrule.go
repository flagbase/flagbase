package segmentrule

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

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	SegmentKey     rsc.Key
}

// ResourceArgs arguments for selecting specific resource
type ResourceArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	SegmentKey     rsc.Key
	SegmentRuleKey rsc.Key
}
