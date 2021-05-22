package identity

import rsc "core/internal/pkg/resource"

// Identity represents a flag consumer (i.e. an entity which requests for an evaluated flagset).
type Identity struct {
	ID  string  `json:"id"`
	Key rsc.Key `json:"key"`
}
