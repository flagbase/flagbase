package flagset

// Flagset represents a set of flags with their appropriate rules and variations
type Flagset map[string]*Flag

// Flag represents a feature flag with its relevant evaluation criteria
type Flag struct {
	FlagKey               string      `json:"flagKey"`
	UseFallthrough        bool        `json:"useFallthrough"`
	FallthroughVariations []Variation `json:"fallthroughVariations"`
	Rules                 []Rule      `json:"rules,omitempty"`
}
