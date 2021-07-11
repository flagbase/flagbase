package model

// Flagset represents a set of flags with their appropriate rules and variations
type Flagset []*Flag

// Flag represents the state of a feature flag that has not been evaluation
type Flag struct {
	ID                    string       `json:"id,omitempty" jsonapi:"primary,raw_flag"`
	FlagKey               string       `json:"flagKey" jsonapi:"attr,flagKey"`
	UseFallthrough        bool         `json:"useFallthrough" jsonapi:"attr,useFallthrough"`
	FallthroughVariations []*Variation `json:"fallthroughVariations" jsonapi:"attr,fallthroughVariations"`
	Rules                 []*Rule      `json:"rules,omitempty" jsonapi:"attr,rules"`
}
