package poller

import (
	evaluationmodel "core/internal/app/evaluation/model"
	evaluationservice "core/internal/app/evaluation/service"
	sdkkeyservice "core/internal/app/sdkkey/service"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/hashutil"
	"core/pkg/model"
	res "core/pkg/response"
	"encoding/json"
)

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func Get(
	senv *srvenv.Env,
	atk rsc.Token,
	etag string,
	a RootHeaders,
) ([]*model.Flag, string, *res.Errors) {
	var e res.Errors

	evalservice := evaluationservice.NewService(senv)
	sks := sdkkeyservice.NewService(senv)

	sksArgs, _err := sks.GetRootArgsFromServerKey(a.SDKKey)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evalservice.Get(
		atk,
		evaluationmodel.RootArgs{
			WorkspaceKey:   sksArgs.WorkspaceKey,
			ProjectKey:     sksArgs.ProjectKey,
			EnvironmentKey: sksArgs.EnvironmentKey,
		},
	)
	if !err.IsEmpty() {
		e.Extend(err)
	}

	oBytes, _err := json.Marshal(r)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}
	retag := hashutil.HashKeys(
		string(oBytes),
	)

	return r, retag, &e
}

// Evaluate returns an evaluated flagset given the user context
// (*) atk: access_type <= service
func Evaluate(
	senv *srvenv.Env,
	atk rsc.Token,
	etag string,
	ectx model.Context,
	a RootHeaders,
) (*model.Evaluations, string, *res.Errors) {
	var e res.Errors

	evalservice := evaluationservice.NewService(senv)
	sks := sdkkeyservice.NewService(senv)

	sksArgs, _err := sks.GetRootArgsFromSDKKey(a.SDKKey)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	r, err := evalservice.Evaluate(
		atk,
		ectx,
		evaluationmodel.RootArgs{
			WorkspaceKey:   sksArgs.WorkspaceKey,
			ProjectKey:     sksArgs.ProjectKey,
			EnvironmentKey: sksArgs.EnvironmentKey,
		},
	)
	if !err.IsEmpty() {
		e.Extend(err)
	}

	rBytes, _err := json.Marshal(*r)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}
	retag := hashutil.HashKeys(
		string(rBytes),
	)

	return r, retag, &e
}
