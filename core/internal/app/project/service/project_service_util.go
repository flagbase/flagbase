package service

import (
	"context"
	environmentmodel "core/internal/app/environment/model"
	projectmodel "core/internal/app/project/model"
	sdkkeymodel "core/internal/app/sdkkey/model"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
)

func (s *Service) createChildren(
	ctx context.Context,
	i projectmodel.Project,
	a projectmodel.RootArgs,
) *res.Errors {
	var e res.Errors

	envProd, err := s.EnvironmentRepo.Create(
		ctx,
		environmentmodel.Environment{
			Key:         "production",
			Name:        "Production",
			Description: "The production environment",
			Tags:        rsc.Tags{"generated"},
		},
		environmentmodel.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   i.Key,
		},
	)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	_, err = s.SDKKeyRepo.Create(
		ctx,
		sdkkeymodel.SDKKey{
			Enabled:     true,
			ExpiresAt:   int64(cons.MaxUnixTime),
			Name:        envProd.Name + " SDK Key",
			Description: rsc.Description("Default SDK key for " + envProd.Name),
			Tags:        rsc.Tags{"generated"},
		},
		sdkkeymodel.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     i.Key,
			EnvironmentKey: envProd.Key,
		},
	)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	envStg, err := s.EnvironmentRepo.Create(
		ctx,
		environmentmodel.Environment{
			Key:         "staging",
			Name:        "Staging",
			Description: "The staging environment",
			Tags:        rsc.Tags{"generated"},
		},
		environmentmodel.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   i.Key,
		},
	)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	_, err = s.SDKKeyRepo.Create(
		ctx,
		sdkkeymodel.SDKKey{
			Enabled:     true,
			ExpiresAt:   int64(cons.MaxUnixTime),
			Name:        envStg.Name + " SDK Key",
			Description: rsc.Description("Default SDK key for " + envStg.Name),
			Tags:        rsc.Tags{"generated"},
		},
		sdkkeymodel.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     i.Key,
			EnvironmentKey: envProd.Key,
		},
	)
	if err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	return &e
}
