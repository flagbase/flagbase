package identity

import rsc "core/internal/pkg/resource"

// Identity represents a flag consumer (i.e. an entity which requests for an evaluated flagset).
type Identity struct {
	ID  rsc.ID  `json:"id"`
	Key rsc.Key `json:"key"`
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
	IdentityKey    rsc.Key
}
