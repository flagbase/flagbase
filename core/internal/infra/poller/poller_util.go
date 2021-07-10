package poller

import (
	evaluationmodel "core/internal/app/evaluation/model"
	evaluationservice "core/internal/app/evaluation/service"
	sdkkeyservice "core/internal/app/sdkkey/service"
	cons "core/internal/pkg/constants"
	"core/pkg/evaluator"
	"core/pkg/hashutil"
	"core/pkg/model"
	res "core/pkg/response"
	"encoding/json"
)

func getAndSetCache(args CachedServiceArgs) (
	*model.Flagset,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *model.Flagset

	evalservice := evaluationservice.NewService(args.Senv)
	sks := sdkkeyservice.NewService(args.Senv)

	a, _err := sks.GetRootArgsFromServerKey(
		args.RootHeaders.SDKKey,
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evalservice.Get(
		args.Atk,
		evaluationmodel.RootArgs{
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

	evalservice := evaluationservice.NewService(args.Senv)
	sks := sdkkeyservice.NewService(args.Senv)

	a, _err := sks.GetRootArgsFromSDKKey(
		args.RootHeaders.SDKKey,
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evalservice.Evaluate(
		args.Atk,
		args.Ectx,
		evaluationmodel.RootArgs{
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
