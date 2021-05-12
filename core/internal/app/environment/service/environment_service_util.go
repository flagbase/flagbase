package service

import (
	"context"
	environmentmodel "core/internal/app/environment/model"
	sdkkeymodel "core/internal/app/sdkkey/model"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
)

func (s *Service) createDefaultChildren(
	ctx context.Context,
	i environmentmodel.Environment,
	a environmentmodel.RootArgs,
) *res.Errors {
	var e res.Errors

	_, _err := s.SDKKeyRepo.Create(
		ctx,
		sdkkeymodel.SDKKey{
			Enabled:     true,
			ExpiresAt:   cons.MaxUnixTime,
			Name:        i.Name + " SDK Key",
			Description: rsc.Description("Default SDK key for " + i.Name),
			Tags:        rsc.Tags{"generated"},
		},
		sdkkeymodel.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: i.Key,
		},
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	return &e
}
