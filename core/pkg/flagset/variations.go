package flagset

type Variation struct {
	VariationKey string `json:"variationKey"`
	Weight       int8   `json:"weight"`
}
