package service

import (
	"context"
	evaluationmodel "core/internal/app/evaluation/model"
	flagmodel "core/internal/app/flag/model"
	flagrepo "core/internal/app/flag/repository"
	segmentrepo "core/internal/app/segment/repository"
	segmentrulerepo "core/internal/app/segmentrule/repository"
	targetingmodel "core/internal/app/targeting/model"
	targetingrepo "core/internal/app/targeting/repository"
	targetingrulemodel "core/internal/app/targetingrule/model"
	targetingrulerepo "core/internal/app/targetingrule/repository"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/evaluator"
	"core/pkg/hashutil"
	"core/pkg/model"
	res "core/pkg/response"
)

type Service struct {
	Senv              *srvenv.Env
	FlagRepo          *flagrepo.Repo
	SegmentRepo       *segmentrepo.Repo
	SegmentRuleRepo   *segmentrulerepo.Repo
	TargetingRepo     *targetingrepo.Repo
	TargetingRuleRepo *targetingrulerepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:              senv,
		FlagRepo:          flagrepo.NewRepo(senv),
		SegmentRepo:       segmentrepo.NewRepo(senv),
		SegmentRuleRepo:   segmentrulerepo.NewRepo(senv),
		TargetingRepo:     targetingrepo.NewRepo(senv),
		TargetingRuleRepo: targetingrulerepo.NewRepo(senv),
	}
}

// Get returns a set raw (non-evaluated) flagsets
// (*) atk: access_type <= service
func (s *Service) Get(
	atk rsc.Token,
	a evaluationmodel.RootArgs,
) (*model.Flagset, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	var o model.Flagset

	fl, _e := s.FlagRepo.List(context.Background(), flagmodel.RootArgs{
		WorkspaceKey: a.WorkspaceKey,
		ProjectKey:   a.ProjectKey,
	})
	if _e != nil {
		e.Append(cons.ErrorInternal, _e.Error())
	}

	type result struct {
		flag    *model.Flag
		err     error
		flagIdx int
	}
	resultChan := make(chan result, len(fl))

	for idx, f := range fl {
		go func(flag *flagmodel.Flag, flagIdx int) {
			res := result{flagIdx: flagIdx}

			t, err := s.TargetingRepo.Get(ctx, targetingmodel.RootArgs{
				WorkspaceKey:   a.WorkspaceKey,
				ProjectKey:     a.ProjectKey,
				FlagKey:        flag.Key,
				EnvironmentKey: a.EnvironmentKey,
			})
			if err != nil {
				res.err = err
				resultChan <- res
				return
			}

			tr, _err := s.TargetingRuleRepo.List(ctx, targetingrulemodel.RootArgs{
				WorkspaceKey:   a.WorkspaceKey,
				ProjectKey:     a.ProjectKey,
				FlagKey:        flag.Key,
				EnvironmentKey: a.EnvironmentKey,
			})
			if _err != nil {
				res.err = _err
				resultChan <- res
				return
			}

			rules := processTargetingRules(ctx, s, a, tr)

			res.flag = &model.Flag{
				ID:                    t.ID,
				FlagKey:               string(flag.Key),
				UseFallthrough:        !t.Enabled,
				FallthroughVariations: t.FallthroughVariations,
				Rules:                 rules,
			}

			resultChan <- res
		}(f, idx)
	}

	o = make(model.Flagset, len(fl))

	for range fl {
		res := <-resultChan
		if res.err != nil {
			e.Append(cons.ErrorInternal, res.err.Error())
		}
		o[res.flagIdx] = res.flag
	}

	return &o, &e
}

// Evaluate returns an evaluated flagset given the user context
func (s *Service) Evaluate(
	atk rsc.Token,
	ectx model.Context,
	a evaluationmodel.RootArgs,
) (*model.Evaluations, *res.Errors) {
	var e res.Errors

	r, err := s.Get(atk, a)
	if !err.IsEmpty() {
		e.Extend(err)
	}

	type evalResult struct {
		eval    *model.Evaluation
		err     error
		flagIdx int
	}
	evalResultChan := make(chan evalResult, len(*r))

	for idx, flag := range *r {
		go func(flag *model.Flag, flagIdx int) {
			res := evalResult{flagIdx: flagIdx}
			salt := hashutil.HashKeys(
				string(a.WorkspaceKey),
				string(a.ProjectKey),
				string(a.EnvironmentKey),
				flag.FlagKey,
				ectx.Identifier,
			)
			res.eval = evaluator.Evaluate(*flag, salt, ectx)
			evalResultChan <- res
		}(flag, idx)
	}

	o := make(model.Evaluations, len(*r))

	for range *r {
		res := <-evalResultChan
		if res.err != nil {
			e.Append(cons.ErrorInternal, res.err.Error())
		}
		o[res.flagIdx] = res.eval
	}

	return &o, &e
}
