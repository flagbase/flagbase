package model

// Variation represents a single flag state, with an appropriate weight
type Variation struct {
	ID           string `json:"id,omitempty" jsonapi:"primary,variation"`
	VariationKey string `json:"variationKey" jsonapi:"attr,variationKey"`
	Weight       int8   `json:"weight" jsonapi:"attr,weight"`
}
