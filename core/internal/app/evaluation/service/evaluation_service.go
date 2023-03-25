package service

import (
	"context"
	evaluationmodel "core/internal/app/evaluation/model"
	evaluationrepo "core/internal/app/evaluation/repository"
	flagrepo "core/internal/app/flag/repository"
	segmentrepo "core/internal/app/segment/repository"
	segmentrulerepo "core/internal/app/segmentrule/repository"
	targetingrepo "core/internal/app/targeting/repository"
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
	EvaluationRepo    *evaluationrepo.Repo
	FlagRepo          *flagrepo.Repo
	SegmentRepo       *segmentrepo.Repo
	SegmentRuleRepo   *segmentrulerepo.Repo
	TargetingRepo     *targetingrepo.Repo
	TargetingRuleRepo *targetingrulerepo.Repo
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv:              senv,
		EvaluationRepo:    evaluationrepo.NewRepo(senv),
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
) ([]*model.Flag, *res.Errors) {
	var e res.Errors
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	r, err := s.EvaluationRepo.List(ctx, a)
	if err != nil {
		e.Append(cons.ErrorNotFound, err.Error())
	}

	return r, &e
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
	evalResultChan := make(chan evalResult, len(r))

	for idx, flag := range r {
		go func(flag model.Flag, flagIdx int) {
			res := evalResult{flagIdx: flagIdx}
			salt := hashutil.HashKeys(
				flag.FlagKey,
				ectx.Identifier,
			)
			res.eval = evaluator.Evaluate(flag, salt, ectx)
			evalResultChan <- res
		}(*flag, idx)
	}

	o := make(model.Evaluations, len(r))

	for range r {
		res := <-evalResultChan
		if res.err != nil {
			e.Append(cons.ErrorInternal, res.err.Error())
		}
		o[res.flagIdx] = res.eval
	}

	return &o, &e
}
