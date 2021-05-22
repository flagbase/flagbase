package model

import rsc "core/internal/pkg/resource"

// Trait a key that represents a certain characteristic of an identity.
type Trait struct {
	ID           string  `jsonapi:"primary,trait"`
	Key          rsc.Key `jsonapi:"attr,key"`
	IsIdentifier bool    `jsonapi:"attr,isIdentifier"`
}
