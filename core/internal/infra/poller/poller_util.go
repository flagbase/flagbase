package poller

import (
	"core/internal/app/evaluation"
	"core/internal/app/sdkkey"
	cons "core/internal/pkg/constants"
	"core/pkg/evaluator"
	"core/pkg/flagset"
	"core/pkg/hashutil"
	res "core/pkg/response"
	"encoding/json"
)

func getAndSetCache(args CachedServiceArgs) (
	*flagset.Flagset,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *flagset.Flagset

	a, _err := sdkkey.GetRootArgsFromServerKey(
		args.Senv,
		args.RootHeaders.SDKKey,
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evaluation.Get(
		args.Senv,
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
	if err := args.Senv.Cache.Set(
		args.CacheKey,
		retag,
		cons.DefaultCacheExpiry,
	).Err(); err != nil {
		panic(err)
	}

	return o, e, retag
}

func evaluateAndSetCache(args CachedServiceArgs) (
	*evaluator.Evaluations,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *evaluator.Evaluations

	a, _err := sdkkey.GetRootArgsFromSDKKey(
		args.Senv,
		args.RootHeaders.SDKKey,
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evaluation.Evaluate(
		args.Senv,
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
	if err := args.Senv.Cache.Set(
		args.CacheKey,
		retag,
		cons.DefaultCacheExpiry,
	).Err(); err != nil {
		panic(err)
	}

	return o, e, retag
}