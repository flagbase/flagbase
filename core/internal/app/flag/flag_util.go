package flag

import (
	"core/internal/app/environment"
	flagmodel "core/internal/app/flag/model"
	"core/internal/app/targeting"
	"core/internal/app/variation"
	rsc "core/internal/pkg/resource"
	"core/pkg/flagset"
	res "core/pkg/response"
)

func (s *Service) createChildren(
	atk rsc.Token,
	i flagmodel.Flag,
	a flagmodel.ResourceArgs,
) *res.Errors {
	var e res.Errors

	envs, _err := environment.List(
		s.Senv,
		atk,
		environment.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	cVar, _err := variation.Create(
		s.Senv,
		atk,
		variation.Variation{
			Key:         "control",
			Name:        "Control",
			Description: "Baseline feature variation",
			Tags:        rsc.Tags{"generated"},
		},
		variation.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			FlagKey:      i.Key,
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}
	_, _err = variation.Create(
		s.Senv,
		atk,
		variation.Variation{
			Key:         "treatment",
			Name:        "Treatment",
			Description: "Treatment feature variation",
			Tags:        rsc.Tags{"generated"},
		},
		variation.RootArgs{
			WorkspaceKey: a.WorkspaceKey,
			ProjectKey:   a.ProjectKey,
			FlagKey:      i.Key,
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	for _, env := range *envs {
		_, _err := targeting.Create(
			s.Senv,
			atk,
			targeting.Targeting{
				Enabled: false,
				FallthroughVariations: []flagset.Variation{
					{
						VariationKey: string(cVar.Key),
						Weight:       100,
					},
				},
			},
			targeting.RootArgs{
				WorkspaceKey:   a.WorkspaceKey,
				ProjectKey:     a.ProjectKey,
				FlagKey:        i.Key,
				EnvironmentKey: env.Key,
			},
		)
		if !_err.IsEmpty() {
			e.Extend(_err)
		}
	}

	return &e
}
