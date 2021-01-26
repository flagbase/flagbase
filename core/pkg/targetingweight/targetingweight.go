package targetingweight

import rsc "core/internal/resource"

// TargetingWeight used to incrementally rollout variations to a specific percentage of users
type TargetingWeight struct {
	ID               rsc.ID  `json:"id"`
	Key              rsc.Key `json:"key"`
	Type             Type    `json:"type"`
	Weight           uint8   `json:"weight"`
	TargetingRuleKey rsc.Key `json:"targetingRuleKey"`
	VariationKey     rsc.Key `json:"variationKey"`
}

// Type is used to specify which entity is weighted (i.e. fallthrough or rule)
type Type string

const (
	// Fallthrough the default rollout on a flag's targeting configuration
	Fallthrough Type = "fallthrough"
	// Rule represents rule-specific rollouts
	Rule Type = "Rule"
)

func (r Type) String() string {
	return string(r)
}
