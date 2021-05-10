package model

import (
	rsc "core/internal/pkg/resource"
)

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
	FlagKey        rsc.Key
}
