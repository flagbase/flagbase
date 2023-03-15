package evaluator

import (
	"core/pkg/model"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestEvaluate(t *testing.T) {
	flag := model.Flag{
		FlagKey: "test_flag",
		Rules: []*model.Rule{
			{
				TraitKey:       "age",
				Operator:       model.OPGreaterThan,
				TraitValue:     "18",
				RuleVariations: []*model.Variation{{VariationKey: "A", Weight: 100}},
			},
		},
		UseFallthrough:        false,
		FallthroughVariations: []*model.Variation{{VariationKey: "B", Weight: 100}},
	}

	ectx := model.Context{
		Traits: map[string]interface{}{
			"age": float64(20),
		},
	}

	evaluation := Evaluate(flag, "some_salt", ectx)

	assert.Equal(t, "test_flag", evaluation.FlagKey)
	assert.Equal(t, "A", evaluation.VariationKey)
	assert.Equal(t, model.ReasonTargeted, evaluation.Reason)
}

func TestEvaluateRules(t *testing.T) {
	rules := []*model.Rule{
		{
			TraitKey:       "age",
			Operator:       model.OPGreaterThan,
			TraitValue:     "18",
			RuleVariations: []*model.Variation{{VariationKey: "A", Weight: 100}},
		},
	}

	salt := "some_salt"
	ectx := model.Context{
		Traits: map[string]interface{}{
			"age": float64(20),
		},
	}

	evaluation := evaluateRules(rules, salt, ectx)

	assert.Equal(t, "A", evaluation.VariationKey)
	assert.Equal(t, model.ReasonTargeted, evaluation.Reason)
}

func TestEvaluateRule(t *testing.T) {
	rule := model.Rule{
		TraitKey:       "age",
		Operator:       model.OPGreaterThan,
		TraitValue:     "18",
		RuleVariations: []*model.Variation{{VariationKey: "A", Weight: 100}},
	}

	salt := "some_salt"
	ectx := model.Context{
		Traits: map[string]interface{}{
			"age": float64(20),
		},
	}

	evaluation, err := evaluateRule(rule, salt, ectx)

	assert.NoError(t, err)
	assert.Equal(t, "A", evaluation.VariationKey)
	assert.Equal(t, model.ReasonTargeted, evaluation.Reason)
}
