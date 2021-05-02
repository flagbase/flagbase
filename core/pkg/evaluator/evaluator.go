package evaluator

// Context evaluation context is essentially the data required to evaluate a flag
type Context struct {
	Identifier string                 `json:"key"`
	Traits     map[string]interface{} `json:"traits,omitempty"`
}

type Evaluations map[string]*Evaluation

type Evaluation struct {
	FlagKey      string `json:"flagKey"`
	VariationKey string `json:"variationKey"`
	Reason       Reason `json:"reason"`
}
