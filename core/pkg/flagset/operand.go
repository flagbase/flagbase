package flagset

// Operator represents an conditional operator (i.e. <operand> <operator> <operand>)
type Operator string

const (
	// OPEqual exact match
	OPEqual Operator = "equal"
	// OPGreaterThan > (numeric comparisons)
	OPGreaterThan Operator = "greater_than"
	// OPGreaterThanOrEqual >= (numeric comparisons)
	OPGreaterThanOrEqual Operator = "greater_than_or_equal"
	// OPContains is a substring
	OPContains Operator = "contains"
	// OPRegex regular expression match
	OPRegex Operator = "regex"
)
