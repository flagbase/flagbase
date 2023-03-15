package evaluator

import (
	"core/pkg/model"
)

// Evaluate the variation for a single flag
func Evaluate(
	flag model.Flag,
	salt string,
	ectx model.Context,
) *model.Evaluation {
	o := &model.Evaluation{
		FlagKey: flag.FlagKey,
	}

	matched := false

	if !flag.UseFallthrough && len(flag.Rules) > 0 {
		eval, match := evaluateRules(flag.Rules, salt, ectx)
		if match {
			o.Reason = eval.Reason
			o.VariationKey = eval.VariationKey
			matched = true
		}
	}

	if !matched {
		o.Reason = model.ReasonFallthrough
		if len(flag.FallthroughVariations) > 1 {
			o.Reason = model.ReasonFallthroughWeighted
		}
		o.VariationKey = deriveVariation(
			salt,
			flag.FallthroughVariations,
		)
	}

	return o
}

func evaluateRules(
	rules []*model.Rule,
	salt string,
	ectx model.Context,
) (eval *model.Evaluation, matched bool) {
	for _, r := range rules {
		eval, matched = evaluateRule(*r, salt, ectx)
		if matched {
			return eval, true
		}
	}

	return nil, false
}

func evaluateRule(
	rule model.Rule,
	salt string,
	ectx model.Context,
) (o *model.Evaluation, matched bool) {
	o = &model.Evaluation{}

	if _, ok := ectx.Traits[rule.TraitKey]; !ok {
		return nil, false
	}

	matches := Matcher[rule.Operator](
		ectx.Traits[rule.TraitKey],
		rule.TraitValue,
	)
	if rule.Negate {
		matches = !matches
	}

	if !matches {
		return nil, false
	}

	o.Reason = model.ReasonTargeted
	if len(rule.RuleVariations) > 1 {
		o.Reason = model.ReasonTargetedWeighted
	}
	o.VariationKey = deriveVariation(
		salt,
		rule.RuleVariations,
	)
	return o, true
}
