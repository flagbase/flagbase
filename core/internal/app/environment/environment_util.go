package environment

import (
	"core/internal/app/sdkkey"
	srv "core/internal/infra/server"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
)

func createDefaultChildren(
	sctx *srv.Ctx,
	atk rsc.Token,
	i Environment,
	a RootArgs,
) *res.Errors {
	var e res.Errors

	_, _err := sdkkey.Create(
		sctx,
		atk,
		sdkkey.SDKKey{
			Enabled:     true,
			ExpiresAt:   cons.MaxUnixTime,
			Name:        rsc.Name(i.Name + " SDK Key"),
			Description: rsc.Description("Default SDK key for " + i.Name),
			Tags:        rsc.Tags{"generated"},
		},
		sdkkey.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: i.Key,
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	return &e
}
