package model

// Variation represents a single flag state, with an appropriate weight
type Variation struct {
	VariationKey string `json:"variationKey"`
	Weight       int8   `json:"weight"`
}
