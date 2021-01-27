package targetingrule

import rsc "core/internal/resource"

// TargetingRule represents a specific rule used during flag evaluation
type TargetingRule struct {
	ID           rsc.ID   `json:"id"`
	Key          rsc.Key  `json:"key"`
	Type         Type     `json:"type"`
	Matches      bool     `json:"matches,omitempty"`
	IdentityKey  rsc.Key  `json:"identityKey"`
	SegmentKey   rsc.Key  `json:"segmentKey"`
	VariationKey rsc.Key  `json:"variationKey"`
	Weights      []Weight `json:"weights,omitempty"`
}

// Type represents the type of targeting rule (identity OR segment)
type Type string

const (
	// Identity represents an entity which requests for an evaluated flagset
	Identity Type = "identity"
	// Segment represents a group of identities with similar characteristics.
	Segment Type = "segment"
)

func (r Type) String() string {
	return string(r)
}

// Weight specifies rollout percentage for a variation
type Weight struct {
	ID           rsc.ID  `json:"id"`
	Weight       uint8   `json:"weight"`
	VariationKey rsc.Key `json:"variationKey"`
}
