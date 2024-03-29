package service

import (
	"context"
	environment "core/internal/app/environment/model"
	targetingmodel "core/internal/app/targeting/model"
	targetingrulemodel "core/internal/app/targetingrule/model"
	variationmodel "core/internal/app/variation/model"
	cons "core/internal/pkg/constants"
	"core/pkg/model"
	res "core/pkg/response"
)

func (s *Service) createChildren(
	ctx context.Context,
	i variationmodel.Variation,
	a variationmodel.RootArgs,
) *res.Errors {
	var e res.Errors

	envs, _err := s.EnvironmentRepo.List(ctx, environment.RootArgs{
		WorkspaceKey: a.WorkspaceKey,
		ProjectKey:   a.ProjectKey,
	})
	if _err != nil {
		e.Append(cons.ErrorInternal, _err.Error())
	}

	for _, env := range envs {
		tArgs := targetingmodel.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: env.Key,
			FlagKey:        a.FlagKey,
		}

		t, _err := s.TargetingRepo.Get(ctx, tArgs)
		if _err != nil {
			e.Append(cons.ErrorInternal, _err.Error())
		}

		nV := &model.Variation{
			ID:           i.ID,
			VariationKey: i.Key.String(),
			Weight:       model.DefaultVariationOffWeight,
		}

		// 1. update targeting fallthrough with new environment
		nt := targetingmodel.Targeting{
			ID:                    t.ID,
			Enabled:               t.Enabled,
			FallthroughVariations: t.FallthroughVariations,
		}
		nt.FallthroughVariations = append(nt.FallthroughVariations, nV)
		_, _err = s.TargetingRepo.CreateFallthroughVariations(ctx, nt, tArgs)
		if _err != nil {
			e.Append(cons.ErrorInternal, _err.Error())
		}

		// 2. update targeting rules with new environment
		trArgs := targetingrulemodel.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			EnvironmentKey: env.Key,
			FlagKey:        a.FlagKey,
		}
		trs, _err := s.TargetingRuleRepo.List(ctx, trArgs)
		if _err != nil {
			e.Append(cons.ErrorInternal, _err.Error())
		}
		for _, tr := range trs {
			tr.RuleVariations = append(tr.RuleVariations, nV)
			_, _err := s.TargetingRuleRepo.CreateRuleVariations(ctx, *tr, trArgs)
			if _err != nil {
				e.Append(cons.ErrorInternal, _err.Error())
			}
		}
	}

	return &e
}
