package evaluator

import (
	"core/pkg/flagset"
	"regexp"
	"strconv"
	"strings"
)

// EvalMapper map containing comparators for all valid operands
type EvalMapper map[flagset.Operator](func(input interface{}, rule string) bool)

// Matcher instance of EvalMapper, used to select the appropriate comparator given the operand
var Matcher EvalMapper = EvalMapper{
	(flagset.OPEqual): func(i interface{}, r string) bool {
		iS, ok := i.(string)
		if !ok {
			return false
		}
		return iS == r
	},
	(flagset.OPContains): func(i interface{}, r string) bool {
		iS, ok := i.(string)
		if !ok {
			return false
		}
		return strings.Contains(iS, r)
	},
	(flagset.OPGreaterThan): func(i interface{}, r string) bool {
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
	(flagset.OPGreaterThanOrEqual): func(i interface{}, r string) bool {
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
	(flagset.OPRegex): func(i interface{}, r string) bool {
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
