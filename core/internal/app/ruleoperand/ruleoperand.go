package ruleoperand

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
