package service

import (
	"context"
	environmentmodel "core/internal/app/environment/model"
	flagmodel "core/internal/app/flag/model"
	sdkkeymodel "core/internal/app/sdkkey/model"
	targetingmodel "core/internal/app/targeting/model"
	variationmodel "core/internal/app/variation/model"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/pkg/model"
	res "core/pkg/response"
	"fmt"
)

func (s *Service) createChildren(
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

	fl, _err := s.FlagRepo.List(ctx, flagmodel.RootArgs{
		WorkspaceKey: a.WorkspaceKey,
		ProjectKey:   a.ProjectKey,
	})
	if len(fl) == 0 || fl == nil {
		return &e
	}
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}
	for _, f := range fl {
		vl, _err := s.VariationRepo.List(ctx, variationmodel.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			FlagKey:      f.Key,
		})
		if _err != nil {
			e.Append(cons.ErrorInternal, _err.Error())
		}
		if len(vl) < 1 {
			e.Append(cons.ErrorInternal, fmt.Sprintf("No variation found on flag with key=%s", f.Key))
		}

		_, _err = s.TargetingRepo.Create(ctx, targetingmodel.Targeting{
			Enabled: false,
			FallthroughVariations: []*model.Variation{
				{
					VariationKey: string(vl[0].Key),
					Weight:       model.DefaultFallthroughVariationWeight,
				},
			},
		}, targetingmodel.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: i.Key,
			FlagKey:        f.Key,
		})
		if _err != nil {
			e.Append(cons.ErrorInternal, _err.Error())
		}
	}

	return &e
}
