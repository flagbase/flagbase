package service

import (
	environmentmodel "core/internal/app/environment/model"
	"core/internal/app/sdkkey"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
)

func (s *Service) createDefaultChildren(
	atk rsc.Token,
	i environmentmodel.Environment,
	a environmentmodel.RootArgs,
) *res.Errors {
	var e res.Errors

	_, _err := sdkkey.Create(
		s.Senv,
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
