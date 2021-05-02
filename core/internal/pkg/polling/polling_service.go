package polling

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/evaluator"
	"core/pkg/hashutil"
	res "core/pkg/response"
)

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func Get(
	sctx *srv.Ctx,
	atk rsc.Token,
	etag string,
	a RootArgs,
) (*res.Success, string, *res.Errors) {
	var e res.Errors
	var o *res.Success
	ctx := context.Background()

	retag := etag
	cacheKey := hashutil.HashKeys(
		"polling-get-raw-ruleset",
		string(a.WorkspaceKey),
		string(a.ProjectKey),
		string(a.EnvironmentKey),
	)
	otag, _ := sctx.Cache.Get(ctx, cacheKey).Result()

	if etag == "" || etag != otag {
		r, _e, newETag := getAndSetCache(GetAndSetCacheArgs{
			Sctx:     sctx,
			Atk:      atk,
			Ctx:      ctx,
			RootArgs: a,
			CacheKey: cacheKey,
		})
		if !_e.IsEmpty() {
			e.Extend(&_e)
		}
		o = &r
		retag = newETag
	} else {
		go getAndSetCache(GetAndSetCacheArgs{
			Sctx:     sctx,
			Atk:      atk,
			Ctx:      ctx,
			RootArgs: a,
			CacheKey: cacheKey,
		})
	}

	return o, retag, &e
}

// Evaluate returns an evaluated flagset given the user context
// (*) atk: access_type <= service
func Evaluate(
	sctx *srv.Ctx,
	atk rsc.Token,
	etag string,
	ectx evaluator.Context,
	a RootArgs,
) (*res.Success, string, *res.Errors) {
	var e res.Errors
	var o *res.Success
	ctx := context.Background()

	retag := etag
	cacheKey := hashutil.HashKeys(
		"polling-get-evaluated-ruleset",
		string(a.WorkspaceKey),
		string(a.ProjectKey),
		string(a.EnvironmentKey),
	)
	otag, _ := sctx.Cache.Get(ctx, cacheKey).Result()

	if etag == "" || etag != otag {
		r, _e, newETag := evaluateAndSetCache(EvaluateAndSetCacheArgs{
			Sctx:     sctx,
			Atk:      atk,
			Ctx:      ctx,
			Ectx:     ectx,
			RootArgs: a,
			CacheKey: cacheKey,
		})
		if !_e.IsEmpty() {
			e.Extend(&_e)
		}
		o = &r
		retag = newETag
	} else {
		go evaluateAndSetCache(EvaluateAndSetCacheArgs{
			Sctx:     sctx,
			Atk:      atk,
			Ctx:      ctx,
			Ectx:     ectx,
			RootArgs: a,
			CacheKey: cacheKey,
		})
	}

	return o, retag, &e
}
