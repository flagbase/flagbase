package model

import rsc "core/internal/pkg/resource"

// Trait a key that represents a certain characteristic of an identity.
type Trait struct {
	ID           rsc.ID  `json:"id"`
	Key          rsc.Key `json:"key"`
	IsIdentifier bool    `json:"isIdentifier"`
}
