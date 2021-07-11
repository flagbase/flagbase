package model

// Context evaluation context is essentially the data required to evaluate a flag
type Context struct {
	Identifier string                 `json:"identifier"`
	Traits     map[string]interface{} `json:"traits,omitempty"`
}

// Evaluations evaluated flagset
type Evaluations []*Evaluation

// Evaluation evaluated flag (i.e. variations derived from the flag's ruleset)
type Evaluation struct {
	ID           string `json:"id,omitempty" jsonapi:"primary,evaluated_flag"`
	FlagKey      string `json:"flagKey" jsonapi:"attr,flagKey"`
	VariationKey string `json:"variationKey" jsonapi:"attr,variationKey"`
	Reason       Reason `json:"reason" jsonapi:"attr,reason"`
}
