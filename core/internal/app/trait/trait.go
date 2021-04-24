package trait

import rsc "core/internal/pkg/resource"

// Trait a key that represents a certain characteristic of an identity.
type Trait struct {
	ID           rsc.ID  `json:"id"`
	Key          rsc.Key `json:"key"`
	IsIdentifier bool    `json:"isIdentifier"`
}

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
}

// ResourceArgs arguments for selecting specific resource
type ResourceArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	TraitKey       rsc.Key
}
