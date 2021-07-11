package model

// Rule represents generic flagbase rule (used by targeting and segments)
type Rule struct {
	ID             string       `json:"id" jsonapi:"primary,rule"`
	RuleType       string       `json:"ruleType" jsonapi:"attr,ruleType"`
	TraitKey       string       `json:"traitKey" jsonapi:"attr,traitKey"`
	TraitValue     string       `json:"traitValue" jsonapi:"attr,traitValue"`
	Operator       Operator     `json:"operator" jsonapi:"attr,operator"`
	Negate         bool         `json:"negate" jsonapi:"attr,negate"`
	RuleVariations []*Variation `json:"ruleVariations" jsonapi:"relation,ruleVariations"`
}
