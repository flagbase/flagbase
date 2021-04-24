package segmentrule

import rsc "core/internal/pkg/resource"

// SegmentRule represents a condition used to filter identities for a particular segment
type SegmentRule struct {
	ID         rsc.ID   `json:"id"`
	Key        rsc.Key  `json:"key"`
	TraitKey   string   `json:"traitKey"`
	TraitValue string   `json:"traitValue"`
	Operator   Operator `json:"operator"`
	Negate     bool     `json:"negate"`
}

// Operator represents an conditional operator (i.e. <operand> <operator> <operand>)
type Operator string

const (
	// Equal exact match
	Equal Operator = "equal"
	// GreaterThan > (numeric comparisons)
	GreaterThan Operator = "greater_than"
	// GreaterThanOrEqual >= (numeric comparisons)
	GreaterThanOrEqual Operator = "greater_than_or_equal"
	// Contains is a substring
	Contains Operator = "contains"
	// Regex regular expression match
	Regex Operator = "regex"
)

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
