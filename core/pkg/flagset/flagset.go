package flagset

type Flagset map[string]*Flag

type Flag struct {
	FlagKey               string      `json:"flagKey"`
	UseFallthrough        bool        `json:"useFallthrough"`
	FallthroughVariations []Variation `json:"fallthroughVariations"`
	Rules                 []Rule      `json:"rules,omitempty"`
}
