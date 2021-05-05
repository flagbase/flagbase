package polling

import (
	"core/internal/app/evaluation"
	"core/internal/app/sdkkey"
	cons "core/internal/pkg/constants"
	"core/pkg/hashutil"
	res "core/pkg/response"
	"encoding/json"
)

func getAndSetCache(args CachedServiceArgs) (
	res.Success,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *res.Success

	a, _err := sdkkey.GetRootArgsFromServerKey(
		args.Sctx,
		args.RootHeaders.SDKKey,
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evaluation.Get(
		args.Sctx,
		args.Atk,
		evaluation.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
		},
	)
	if !err.IsEmpty() {
		e.Extend(err)
	}

	o = r

	oBytes, _err := json.Marshal(o)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}
	retag := hashutil.HashKeys(
		string(oBytes),
	)
	if err := args.Sctx.Cache.Set(
		args.Ctx,
		args.CacheKey,
		retag,
		cons.DefaultCacheExpiry,
	).Err(); err != nil {
		panic(err)
	}

	return *o, e, retag
}

func evaluateAndSetCache(args CachedServiceArgs) (
	res.Success,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *res.Success

	a, _err := sdkkey.GetRootArgsFromSDKKey(
		args.Sctx,
		args.RootHeaders.SDKKey,
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evaluation.Evaluate(
		args.Sctx,
		args.Atk,
		args.Ectx,
		evaluation.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: a.EnvironmentKey,
		},
	)
	if !err.IsEmpty() {
		e.Extend(err)
	}

	o = r

	oBytes, _err := json.Marshal(o)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}
	retag := hashutil.HashKeys(
		string(oBytes),
	)
	if err := args.Sctx.Cache.Set(
		args.Ctx,
		args.CacheKey,
		retag,
		cons.DefaultCacheExpiry,
	).Err(); err != nil {
		panic(err)
	}

	return *o, e, retag
}
