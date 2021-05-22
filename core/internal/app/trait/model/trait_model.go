package model

import rsc "core/internal/pkg/resource"

// Trait a key that represents a certain characteristic of an identity.
type Trait struct {
	ID           string  `json:"id" jsonapi:"primary,trait"`
	Key          rsc.Key `json:"key" jsonapi:"attr,key"`
	IsIdentifier bool    `json:"isIdentifier" jsonapi:"attr,isIdentifier"`
}
