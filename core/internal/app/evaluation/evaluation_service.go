package evaluation

import (
	"core/internal/app/flag"
	"core/internal/app/segmentrule"
	"core/internal/app/targeting"
	"core/internal/app/targetingrule"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/evaluator"
	"core/pkg/flagset"
	"core/pkg/hashutil"
	res "core/pkg/response"
)

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func Get(
	sctx *srv.Ctx,
	atk rsc.Token,
	a RootArgs,
) (*flagset.Flagset, *res.Errors) {
	var e res.Errors

	o := make(flagset.Flagset)

	fl, err := flag.List(sctx, atk, flag.RootArgs{
		WorkspaceKey: a.WorkspaceKey,
		ProjectKey:   a.ProjectKey,
	})
	if !err.IsEmpty() {
		e.Extend(err)
	}

	for _, f := range *fl {
		t, err := targeting.Get(sctx, atk, targeting.RootArgs{
			WorkspaceKey:   a.WorkspaceKey,
			ProjectKey:     a.ProjectKey,
			FlagKey:        f.Key,
			EnvironmentKey: a.EnvironmentKey,
		})
		if !err.IsEmpty() {
			e.Extend(err)
		}

		tr, err := targetingrule.List(sctx, atk, targetingrule.RootArgs{
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
					sr, err := segmentrule.List(sctx, atk, segmentrule.RootArgs{
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
	sctx *srv.Ctx,
	atk rsc.Token,
	ectx evaluator.Context,
	a RootArgs,
) (*evaluator.Evaluations, *res.Errors) {
	var e res.Errors

	r, err := Get(sctx, atk, a)
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
