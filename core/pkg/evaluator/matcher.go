package evaluator

import (
	"core/pkg/model"
	"regexp"
	"strconv"
	"strings"
)

// EvalMapper map containing comparators for all valid operands
type EvalMapper map[model.Operator](func(input interface{}, rule string) bool)

// Matcher instance of EvalMapper, used to select the appropriate comparator given the operand
var Matcher EvalMapper = EvalMapper{
	(model.OPEqual): func(i interface{}, r string) bool {
		iS, ok := i.(string)
		if !ok {
			return false
		}
		return iS == r
	},
	(model.OPContains): func(i interface{}, r string) bool {
		iS, ok := i.(string)
		if !ok {
			return false
		}
		return strings.Contains(iS, r)
	},
	(model.OPGreaterThan): func(i interface{}, r string) bool {
		rV, err := strconv.ParseFloat(r, 64)
		if err != nil {
			return false
		}
		iV, ok := i.(float64)
		if !ok {
			return false
		}
		return iV > rV
	},
	(model.OPGreaterThanOrEqual): func(i interface{}, r string) bool {
		rV, err := strconv.ParseFloat(r, 64)
		if err != nil {
			return false
		}
		iV, ok := i.(float64)
		if !ok {
			return false
		}
		return iV >= rV
	},
	(model.OPRegex): func(i interface{}, r string) bool {
		iS, ok := i.(string)
		if !ok {
			return false
		}
		matched, err := regexp.MatchString(r, iS)
		if err != nil {
			return false
		}
		return matched
	},
}
