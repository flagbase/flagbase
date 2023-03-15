package service

import (
	"context"
	evaluationmodel "core/internal/app/evaluation/model"
	segmentrulemodel "core/internal/app/segmentrule/model"
	targetingrulemodel "core/internal/app/targetingrule/model"
	rsc "core/internal/pkg/resource"
	"core/pkg/model"
)

func processTargetingRules(
	ctx context.Context,
	s *Service,
	a evaluationmodel.RootArgs,
	tr []*targetingrulemodel.TargetingRule,
) []*model.Rule {
	var rules []*model.Rule
	for _, _tr := range tr {
		switch _tr.Type {
		case string(rsc.Trait):
			rules = append(rules, &model.Rule{
				ID:             _tr.ID,
				RuleType:       _tr.Type,
				TraitKey:       _tr.TraitKey,
				TraitValue:     _tr.TraitValue,
				Operator:       _tr.Operator,
				Negate:         _tr.Negate,
				RuleVariations: _tr.RuleVariations,
			})
		case string(rsc.Segment):
			if string(_tr.SegmentKey) != "" {
				sr, err := s.SegmentRuleRepo.List(ctx, segmentrulemodel.RootArgs{
					WorkspaceKey:   a.WorkspaceKey,
					ProjectKey:     a.ProjectKey,
					EnvironmentKey: a.EnvironmentKey,
					SegmentKey:     _tr.SegmentKey,
				})
				if err != nil {
					continue
				}

				for _, _sr := range sr {
					rules = append(rules, &model.Rule{
						ID:             _tr.ID,
						RuleType:       _tr.Type,
						TraitKey:       _sr.TraitKey,
						TraitValue:     _sr.TraitValue,
						Operator:       _sr.Operator,
						Negate:         _sr.Negate,
						RuleVariations: _tr.RuleVariations,
					})
				}
			}
		}
	}

	return rules
}
