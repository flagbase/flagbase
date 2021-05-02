package flagset

// Rule represents generic flagbase rule (used by targeting and segments)
type Rule struct {
	RuleType       string      `json:"ruleType"`
	TraitKey       string      `json:"traitKey"`
	TraitValue     string      `json:"traitValue"`
	Operator       Operator    `json:"operator"`
	Negate         bool        `json:"negate"`
	RuleVariations []Variation `json:"ruleVariations"`
}
