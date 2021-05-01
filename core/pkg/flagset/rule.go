package flagset

type Rule struct {
	RuleType       string      `json:"ruleType"`
	TraitKey       string      `json:"traitKey"`
	TraitValue     string      `json:"traitValue"`
	Operator       Operator    `json:"operator"`
	Negate         bool        `json:"negate"`
	RuleVariations []Variation `json:"ruleVariations"`
}
