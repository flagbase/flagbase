package polling

import (
	"context"
	"core/internal/app/evaluation"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/evaluator"
	"core/pkg/hashutil"
	res "core/pkg/response"
	"encoding/json"
)

type GetAndSetCacheArgs struct {
	Sctx     *srv.Ctx
	Atk      rsc.Token
	Ctx      context.Context
	RootArgs RootArgs
	CacheKey string
}

func getAndSetCache(args GetAndSetCacheArgs) (
	res.Success,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *res.Success

	r, err := evaluation.Get(
		args.Sctx,
		args.Atk,
		evaluation.RootArgs{
			WorkspaceKey:   args.RootArgs.WorkspaceKey,
			ProjectKey:     args.RootArgs.ProjectKey,
			EnvironmentKey: args.RootArgs.EnvironmentKey,
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

type EvaluateAndSetCacheArgs struct {
	Sctx     *srv.Ctx
	Atk      rsc.Token
	Ctx      context.Context
	Ectx     evaluator.Context
	RootArgs RootArgs
	CacheKey string
}

func evaluateAndSetCache(args EvaluateAndSetCacheArgs) (
	res.Success,
	res.Errors,
	string,
) {
	var e res.Errors
	var o *res.Success

	r, err := evaluation.Evaluate(
		args.Sctx,
		args.Atk,
		args.Ectx,
		evaluation.RootArgs{
			WorkspaceKey:   args.RootArgs.WorkspaceKey,
			ProjectKey:     args.RootArgs.ProjectKey,
			EnvironmentKey: args.RootArgs.EnvironmentKey,
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
