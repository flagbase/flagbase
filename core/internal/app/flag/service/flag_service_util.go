package service

import (
	"context"
	environmentmodel "core/internal/app/environment/model"
	flagmodel "core/internal/app/flag/model"
	targetingmodel "core/internal/app/targeting/model"
	variationmodel "core/internal/app/variation/model"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/pkg/model"
	res "core/pkg/response"
)

func (s *Service) createChildren(
	ctx context.Context,
	i flagmodel.Flag,
	a flagmodel.RootArgs,
) *res.Errors {
	var e res.Errors

	envs, _err := s.EnvironmentRepo.List(
		ctx,
		environmentmodel.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
		},
	)
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	cVar, _e := s.VariationRepo.Create(
		ctx,
		variationmodel.Variation{
			Key:         "control",
			Name:        "Control",
			Description: "Baseline feature variation",
			Tags:        rsc.Tags{"generated"},
		},
		variationmodel.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			FlagKey:      i.Key,
		},
	)
	if _e != nil {
		e.Append(cons.ErrorInternal, _e.Error())
	}

	_, _e = s.VariationRepo.Create(
		ctx,
		variationmodel.Variation{
			Key:         "treatment",
			Name:        "Treatment",
			Description: "Treatment feature variation",
			Tags:        rsc.Tags{"generated"},
		},
		variationmodel.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			FlagKey:      i.Key,
		},
	)
	if _e != nil {
		e.Append(cons.ErrorInternal, _e.Error())
	}

	for _, env := range envs {
		_, _err := s.TargetingRepo.Create(
			ctx,
			targetingmodel.Targeting{
				Enabled: false,
				FallthroughVariations: []*model.Variation{
					{
						VariationKey: string(cVar.Key),
						Weight:       model.DefaultFallthroughVariationWeight,
					},
				},
			},
			targetingmodel.RootArgs{
				WorkspaceKey:   a.WorkspaceKey,
				ProjectKey:     a.ProjectKey,
				FlagKey:        i.Key,
				EnvironmentKey: env.Key,
			},
		)
		if _err != nil {
			e.Append(cons.ErrorInternal, _e.Error())
		}
	}

	return &e
}
