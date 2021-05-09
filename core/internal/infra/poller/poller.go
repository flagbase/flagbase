package poller

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/evaluator"
)

// RootHeaders arguments for selecting root resource
type RootHeaders struct {
	SDKKey string
}

// RootArgs arguments for selecting root resource
type RootArgs struct {
	WorkspaceKey   rsc.Key
	ProjectKey     rsc.Key
	EnvironmentKey rsc.Key
}

// CachedServiceArgs args used for cached services
type CachedServiceArgs struct {
	Senv        *srvenv.Env
	Ctx         context.Context
	Atk         rsc.Token
	Ectx        evaluator.Context
	RootHeaders RootHeaders
	CacheKey    string
}
