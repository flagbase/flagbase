package polling

import (
	"context"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/evaluator"
	"core/pkg/flagset"
	"core/pkg/hashutil"
	res "core/pkg/response"
)

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func Get(
	sctx *srv.Ctx,
	atk rsc.Token,
	etag string,
	a RootHeaders,
) (*flagset.Flagset, string, *res.Errors) {
	var e res.Errors
	var o *flagset.Flagset
	ctx := context.Background()

	retag := etag
	cacheKey := hashutil.HashKeys(
		"polling-get-raw-ruleset",
		a.SDKKey,
	)
	otag, _ := sctx.Cache.Get(ctx, cacheKey).Result()

	if etag == "" || etag != otag {
		r, _e, newETag := getAndSetCache(CachedServiceArgs{
			Sctx:        sctx,
			Ctx:         ctx,
			Atk:         atk,
			RootHeaders: a,
			CacheKey:    cacheKey,
		})
		if !_e.IsEmpty() {
			e.Extend(&_e)
		}
		o = r
		retag = newETag
	} else {
		go getAndSetCache(CachedServiceArgs{
			Sctx:        sctx,
			Ctx:         ctx,
			Atk:         atk,
			RootHeaders: a,
			CacheKey:    cacheKey,
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
	a RootHeaders,
) (*evaluator.Evaluations, string, *res.Errors) {
	var e res.Errors
	var o *evaluator.Evaluations
	ctx := context.Background()

	retag := etag
	cacheKey := hashutil.HashKeys(
		"polling-get-evaluated-ruleset",
		a.SDKKey,
		ectx.Identifier,
	)
	otag, _ := sctx.Cache.Get(ctx, cacheKey).Result()

	if etag == "" || etag != otag {
		r, _e, newETag := evaluateAndSetCache(CachedServiceArgs{
			Sctx:        sctx,
			Ctx:         ctx,
			Atk:         atk,
			Ectx:        ectx,
			RootHeaders: a,
			CacheKey:    cacheKey,
		})
		if !_e.IsEmpty() {
			e.Extend(&_e)
		}
		o = r
		retag = newETag
	} else {
		go evaluateAndSetCache(CachedServiceArgs{
			Sctx:        sctx,
			Ctx:         ctx,
			Atk:         atk,
			Ectx:        ectx,
			RootHeaders: a,
			CacheKey:    cacheKey,
		})
	}

	return o, retag, &e
}
