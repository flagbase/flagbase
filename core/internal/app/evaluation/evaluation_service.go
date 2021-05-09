package evaluation

import (
	"context"
	flagmodel "core/internal/app/flag/model"
	flagrepo "core/internal/app/flag/repository"
	"core/internal/app/segmentrule"
	"core/internal/app/targeting"
	"core/internal/app/targetingrule"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/evaluator"
	"core/pkg/flagset"
	"core/pkg/hashutil"
	res "core/pkg/response"
)

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func Get(
	senv *srvenv.Env,
	atk rsc.Token,
	a RootArgs,
) (*flagset.Flagset, *res.Errors) {
	var e res.Errors

	o := make(flagset.Flagset)

	fr := flagrepo.Repo{
		DB: senv.DB,
	}

	fl, _e := fr.List(context.Background(), flagmodel.ResourceArgs{
		WorkspaceKey: a.WorkspaceKey,
		ProjectKey:   a.ProjectKey,
	})
	if _e != nil {
		e.Append(cons.ErrorInternal, _e.Error())
	}

	for _, f := range *fl {
		t, err := targeting.Get(senv, atk, targeting.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			FlagKey:        f.Key,
			EnvironmentKey: a.EnvironmentKey,
		})
		if !err.IsEmpty() {
			e.Extend(err)
		}

		tr, err := targetingrule.List(senv, atk, targetingrule.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			FlagKey:        f.Key,
			EnvironmentKey: a.EnvironmentKey,
		})
		if !err.IsEmpty() {
			e.Extend(err)
		}

		o[string(f.Key)] = &flagset.Flag{
			FlagKey:               string(f.Key),
			UseFallthrough:        !t.Enabled,
			FallthroughVariations: t.FallthroughVariations,
		}

		o[string(f.Key)].Rules = []flagset.Rule{}

		for _, _tr := range *tr {
			switch _tr.Type {
			case string(rsc.Trait):
				o[string(f.Key)].Rules = append(o[string(f.Key)].Rules, flagset.Rule{
					RuleType:       _tr.Type,
					TraitKey:       _tr.TraitKey,
					TraitValue:     _tr.TraitValue,
					Operator:       _tr.Operator,
					Negate:         _tr.Negate,
					RuleVariations: _tr.RuleVariations,
				})
			case string(rsc.Segment):
				if string(_tr.SegmentKey) != "" {
					sr, err := segmentrule.List(senv, atk, segmentrule.RootArgs{
						WorkspaceKey:   a.WorkspaceKey,
						ProjectKey:     a.ProjectKey,
						EnvironmentKey: a.EnvironmentKey,
						SegmentKey:     _tr.SegmentKey,
					})
					if !err.IsEmpty() {
						e.Extend(err)
					}

					for _, _sr := range *sr {
						o[string(f.Key)].Rules = append(o[string(f.Key)].Rules, flagset.Rule{
							RuleType:       _tr.Type,
							TraitKey:       _sr.TraitKey,
							TraitValue:     _sr.TraitValue,
							Operator:       _sr.Operator,
							Negate:         _sr.Negate,
							RuleVariations: _tr.RuleVariations,
						})
					}
				}
				// TODO match identity ~ case string(rsc.Identity):
			}
		}
	}

	return &o, &e
}

// Evaluate returns an evaluated flagset given the user context
// (*) atk: access_type <= service
func Evaluate(
	senv *srvenv.Env,
	atk rsc.Token,
	ectx evaluator.Context,
	a RootArgs,
) (*evaluator.Evaluations, *res.Errors) {
	var e res.Errors

	r, err := Get(senv, atk, a)
	if !err.IsEmpty() {
		e.Extend(err)
	}

	o := make(evaluator.Evaluations)

	for _, flag := range *r {
		salt := hashutil.HashKeys(
			string(a.WorkspaceKey),
			string(a.ProjectKey),
			string(a.EnvironmentKey),
			flag.FlagKey,
			ectx.Identifier,
		)
		o[flag.FlagKey] = evaluator.Evaluate(*flag, salt, ectx)
	}

	return &o, &e
}
