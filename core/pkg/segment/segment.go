package segment

import rsc "core/internal/resource"

// Segment represents a group of identities with similar characteristics.
type Segment struct {
	ID          rsc.ID          `json:"id"`
	Key         rsc.Key         `json:"key"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}

// Rule represents a condition used to filter identities for a particular segment
type Rule struct {
	ID         rsc.ID       `json:"id"`
	TraitKey   string       `json:"traitKey"`
	TraitValue string       `json:"traitValue"`
	Operator   RuleOperator `json:"operator"`
	Negate     bool         `json:"negate"`
}

// RuleOperator represents an opera
type RuleOperator string

const (
	// Equal exact match
	Equal RuleOperator = "equal"
	// GreaterThan > (numeric comparisons)
	GreaterThan RuleOperator = "greater_than"
	// GreaterThanOrEqual >= (numeric comparisons)
	GreaterThanOrEqual RuleOperator = "greater_than_or_equal"
	// Contains is a substring
	Contains RuleOperator = "contains"
	// Regex regular expression match
	Regex RuleOperator = "regex"
)
