package identity

import rsc "core/internal/resource"

// Identity represents a flag consumer (i.e. an entity which requests for an evaluated flagset).
type Identity struct {
	ID  rsc.ID  `json:"id"`
	Key rsc.Key `json:"key"`
}
