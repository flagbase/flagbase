package evaluator

import (
	"core/pkg/model"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestMatcher(t *testing.T) {
	tests := []struct {
		name     string
		operator model.Operator
		input    interface{}
		rule     string
		expected bool
	}{
		{"Equal", model.OPEqual, "apple", "apple", true},
		{"Contains", model.OPContains, "pineapple", "apple", true},
		{"GreaterThan", model.OPGreaterThan, float64(5), "3", true},
		{"GreaterThanOrEqual", model.OPGreaterThanOrEqual, float64(5), "5", true},
		{"Regex", model.OPRegex, "hello123world", `\d+`, true},
		{"InvalidType", model.OPGreaterThan, "invalid", "3", false},
		{"InvalidRule", model.OPGreaterThan, float64(5), "invalid", false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := Matcher[tt.operator](tt.input, tt.rule)
			assert.Equal(t, tt.expected, result)
		})
	}
}
