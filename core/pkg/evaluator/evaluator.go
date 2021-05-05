package evaluator

// Context evaluation context is essentially the data required to evaluate a flag
type Context struct {
	Identifier string                 `json:"identifier"`
	Traits     map[string]interface{} `json:"traits,omitempty"`
}

// Evaluations evaluated flagset
type Evaluations map[string]*Evaluation

// Evaluation evaluated flag (i.e. variations derived from the flag's ruleset)
type Evaluation struct {
	FlagKey      string `json:"flagKey"`
	VariationKey string `json:"variationKey"`
	Reason       Reason `json:"reason"`
}
