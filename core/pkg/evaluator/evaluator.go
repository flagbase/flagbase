package evaluator

type Context struct {
	Identifier string            `json:"key"`
	Traits     map[string]string `json:"traits,omitempty"`
}

type Evaluations map[string]*Evaluation

type Evaluation struct {
	FlagKey      string `json:"flagKey"`
	VariationKey string `json:"variationKey"`
	Reason       Reason `json:"reason"`
}
