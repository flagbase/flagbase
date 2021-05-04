package sdkkey

import rsc "core/internal/pkg/resource"

// SDKKey is used to provide fast access to a particular environment
type SDKKey struct {
	ID          rsc.ID          `json:"id"`
	Enabled     bool            `json:"enabled,omitempty"`
	ClientKey   string          `json:"clientKey"`
	ServerKey   string          `json:"serverKey"`
	ExpiresAt   int64           `json:"expiresAt,omitempty"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
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
	ID             rsc.Key
}
