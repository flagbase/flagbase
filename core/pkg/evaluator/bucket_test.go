package evaluator

import (
	"core/pkg/model"
	"strconv"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestDeriveVariationSingleIteration(t *testing.T) {
	variations := []*model.Variation{
		{VariationKey: "A", Weight: 50},
		{VariationKey: "B", Weight: 50},
	}

	derivedVariation := deriveVariation("some_salt", variations)

	assert.Contains(t, []string{"A", "B"}, derivedVariation)
}

func TestDeriveVariationMultipleIterations(t *testing.T) {
	variations := []*model.Variation{
		{VariationKey: "A", Weight: 16},
		{VariationKey: "B", Weight: 16},
		{VariationKey: "C", Weight: 16},
		{VariationKey: "D", Weight: 16},
		{VariationKey: "E", Weight: 16},
		{VariationKey: "F", Weight: 16},
	}

	exposures := make(map[string]int)
	for i := 1; i <= 100000000; i++ {
		salt := strconv.Itoa(i)
		derivedVariation := deriveVariation(salt, variations)

		exposures[derivedVariation] += 1
	}

	// deterministic hashing ensures consistent bucketing
	assert.Equal(t, exposures["A"], 16002131)
	assert.Equal(t, exposures["B"], 16005592)
	assert.Equal(t, exposures["C"], 15998409)
	assert.Equal(t, exposures["D"], 16000163)
	assert.Equal(t, exposures["E"], 15998878)
	assert.Equal(t, exposures["F"], 19994827)
}
