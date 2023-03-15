package evaluator

import (
	"core/pkg/model"
	"regexp"
	"strconv"
	"strings"
	"sync"
)

// EvalMapper map containing comparators for all valid operands
type EvalMapper map[model.Operator](func(input interface{}, rule string) bool)

// Matcher instance of EvalMapper, used to select the appropriate comparator given the operand
var Matcher = EvalMapper{
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
		iV, ok := i.(float64)
		if !ok {
			return false
		}
		rV, err := parseFloatCached(r)
		if err != nil {
			return false
		}
		return iV > rV
	},
	(model.OPGreaterThanOrEqual): func(i interface{}, r string) bool {
		iV, ok := i.(float64)
		if !ok {
			return false
		}
		rV, err := parseFloatCached(r)
		if err != nil {
			return false
		}
		return iV >= rV
	},
	(model.OPRegex): func(i interface{}, r string) bool {
		iS, ok := i.(string)
		if !ok {
			return false
		}
		matched, err := matchStringCached(r, iS)
		if err != nil {
			return false
		}
		return matched
	},
}

var (
	floatCache   = make(map[string]float64)
	floatCacheMu sync.Mutex
)

func parseFloatCached(s string) (float64, error) {
	floatCacheMu.Lock()
	defer floatCacheMu.Unlock()

	v, ok := floatCache[s]
	if ok {
		return v, nil
	}

	v, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return 0, err
	}

	floatCache[s] = v
	return v, nil
}

var (
	regexCache   = make(map[string]*regexp.Regexp)
	regexCacheMu sync.Mutex
)

func matchStringCached(pattern, s string) (bool, error) {
	regexCacheMu.Lock()
	defer regexCacheMu.Unlock()

	re, ok := regexCache[pattern]
	if !ok {
		var err error
		re, err = regexp.Compile(pattern)
		if err != nil {
			return false, err
		}
		regexCache[pattern] = re
	}

	return re.MatchString(s), nil
}
