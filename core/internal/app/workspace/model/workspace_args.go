package model

import rsc "core/internal/pkg/resource"

// RootArgs arguments for selecting root resource
type RootArgs struct{}

// ResourceArgs arguments for selecting specific resource
type ResourceArgs struct {
	WorkspaceKey rsc.Key
}
