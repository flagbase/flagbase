package targeting

import rsc "core/internal/resource"

// Targeting defines the evaluation criteria for a particular flag
type Targeting struct {
	ID                      rsc.ID  `json:"id"`
	Enabled                 bool    `json:"enabled"`
	FallthroughVariationKey rsc.Key `json:"fallthroughVariationKey,omitempty"`
}
