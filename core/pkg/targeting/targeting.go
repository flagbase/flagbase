package targeting

import rsc "core/internal/resource"

// Targeting represents a set of conditions (aka ruleset) used during flag evaluation.
type Targeting struct {
	ID      rsc.ID `json:"id"`
	Enabled bool   `json:"enabled"`
}
