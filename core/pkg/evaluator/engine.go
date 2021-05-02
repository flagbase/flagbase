package evaluator

import (
	"core/pkg/flagset"

	"errors"
)

func Evaluate(
	flag flagset.Flag,
	salt string,
	ectx Context,
) *Evaluation {
	o := &Evaluation{
		FlagKey: flag.FlagKey,
	}

	if len(flag.Rules) > 0 && flag.UseFallthrough == false {
		eval := evaluateRules(flag.Rules, salt, ectx)
		o.Reason = eval.Reason
		o.VariationKey = eval.VariationKey
	}

	if o.VariationKey == "" {
		o.Reason = Fallthrough
		if len(flag.FallthroughVariations) > 1 {
			o.Reason = FallthroughWeighted
		}
		o.VariationKey = deriveVariation(
			salt,
			flag.FallthroughVariations,
		)
	}

	return o
}

func evaluateRules(
	rules []flagset.Rule,
	salt string,
	ectx Context,
) Evaluation {
	var o Evaluation
	variationVotes := make(map[string]int)

	maxVotes := 0
	for _, r := range rules {
		eval, err := evaluateRule(r, salt, ectx)
		if err == nil {
			if _, ok := variationVotes[eval.VariationKey]; !ok {
				variationVotes[eval.VariationKey] = 0
			}
			variationVotes[eval.VariationKey] += 1
			if variationVotes[eval.VariationKey] > maxVotes {
				maxVotes = variationVotes[eval.VariationKey]
				o = eval
			}
		}
	}

	return o
}

func evaluateRule(
	rule flagset.Rule,
	salt string,
	ectx Context,
) (Evaluation, error) {
	var o Evaluation

	if _, ok := ectx.Traits[rule.TraitKey]; !ok {
		return o, errors.New("rule trait not present in context")
	}

	matches := Matcher[rule.Operator](
		ectx.Traits[rule.TraitKey],
		rule.TraitValue,
	)
	if rule.Negate {
		matches = !matches
	}

	if !matches {
		return o, errors.New("rule does not match")
	}

	o.Reason = Targeted
	if len(rule.RuleVariations) > 1 {
		o.Reason = TargetedWeighted
	}
	o.VariationKey = deriveVariation(
		salt,
		rule.RuleVariations,
	)
	return o, nil
}
