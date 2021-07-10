package poller

import (
	"context"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/evaluator"
	"core/pkg/hashutil"
	"core/pkg/model"
	res "core/pkg/response"
)

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func Get(
	senv *srvenv.Env,
	atk rsc.Token,
	etag string,
	a RootHeaders,
) (*model.Flagset, string, *res.Errors) {
	var e res.Errors
	var o *model.Flagset
	ctx := context.Background()

	retag := etag
	cacheKey := hashutil.HashKeys(
		"polling-get-raw-ruleset",
		a.SDKKey,
	)
	otag, _ := senv.Cache.Get(cacheKey).Result()

	if etag == "" || etag != otag {
		r, _e, newETag := getAndSetCache(CachedServiceArgs{
			Senv:        senv,
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
			Senv:        senv,
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
	senv *srvenv.Env,
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
	otag, _ := senv.Cache.Get(cacheKey).Result()

	if etag == "" || etag != otag {
		r, _e, newETag := evaluateAndSetCache(CachedServiceArgs{
			Senv:        senv,
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
			Senv:        senv,
			Ctx:         ctx,
			Atk:         atk,
			Ectx:        ectx,
			RootHeaders: a,
			CacheKey:    cacheKey,
		})
	}

	return o, retag, &e
}
