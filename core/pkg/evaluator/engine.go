package evaluator

import (
	"core/pkg/flagset"
	"encoding/binary"
	"fmt"
)

func Evaluate(flag flagset.Flag, salt string, ectx Context) *Evaluation {
	o := &Evaluation{
		FlagKey: flag.FlagKey,
	}

	if (flag.Rules == nil || len(flag.Rules) == 0) || flag.UseFallthrough == true {
		o.Reason = Fallthrough
		if len(flag.FallthroughVariations) > 1 {
			o.Reason = FallthroughWeighted
		}
		o.VariationKey = deriveVariation(salt, flag.FallthroughVariations)
	} else if len(flag.Rules) > 0 && flag.UseFallthrough == false {
		eval := evalRules(flag.Rules, ectx)
		o.Reason = eval.Reason
		o.VariationKey = eval.VariationKey
	}

	return o
}

func evalRules(rules []flagset.Rule, ectx Context) Evaluation {
	for _, r := range rules {
		fmt.Printf("%+v", evalRule(r))
	}

	return Evaluation{
		VariationKey: "",
		Reason:       Targeted,
	}
}

func evalRule(rule flagset.Rule) flagset.Variation {
	return flagset.Variation{
		VariationKey: "",
	}
}

func deriveVariation(
	salt string,
	variations []flagset.Variation,
) string {
	saltVal := binary.LittleEndian.Uint16([]byte(salt))
	userBucket := int8(saltVal % 100)

	var currentBucket int8 = 0
	for _, v := range variations {
		currentBucket += v.Weight
		if userBucket < currentBucket {
			return v.VariationKey
		}
	}

	return variations[len(variations)-1].VariationKey
}
