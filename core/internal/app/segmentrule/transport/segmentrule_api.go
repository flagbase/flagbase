package transport

import (
	segmentrulemodel "core/internal/app/segmentrule/model"
	segmentruleservice "core/internal/app/segmentrule/service"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIHandler API handler context
type APIHandler struct {
	Senv               *srvenv.Env
	SegmentRuleService *segmentruleservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:               senv,
		SegmentRuleService: segmentruleservice.NewService(senv),
	}
}

// ApplyRoutes segment route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group("/")
	rootPath := httputil.AppendPath(
		httputil.AppendRoute(
			httputil.BuildPath(
				rsc.WorkspaceKey,
				rsc.ProjectKey,
				rsc.SegmentKey,
			),
			rsc.RouteRule,
		),
		rsc.EnvironmentKey,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.RuleKey,
	)

	routes.GET(rootPath, h.listAPIHandler)
	routes.POST(rootPath, h.createAPIHandler)
	routes.GET(resourcePath, h.getAPIHandler)
	routes.PATCH(resourcePath, h.updateAPIHandler)
	routes.DELETE(resourcePath, h.deleteAPIHandler)
}

func (h *APIHandler) listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := h.SegmentRuleService.List(
		atk,
		segmentrulemodel.RootArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			SegmentKey:     httputil.GetParam(ctx, rsc.SegmentKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func (h *APIHandler) createAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i segmentrulemodel.SegmentRule
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.SegmentRuleService.Create(
		atk,
		i,
		segmentrulemodel.RootArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			SegmentKey:     httputil.GetParam(ctx, rsc.SegmentKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusCreated,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func (h *APIHandler) getAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := h.SegmentRuleService.Get(
		atk,
		segmentrulemodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			SegmentKey:     httputil.GetParam(ctx, rsc.SegmentKey),
			SegmentRuleKey: httputil.GetParam(ctx, rsc.RuleKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func (h *APIHandler) updateAPIHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.SegmentRuleService.Update(
		atk,
		i,
		segmentrulemodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			SegmentKey:     httputil.GetParam(ctx, rsc.SegmentKey),
			SegmentRuleKey: httputil.GetParam(ctx, rsc.RuleKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func (h *APIHandler) deleteAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := h.SegmentRuleService.Delete(
		atk,
		segmentrulemodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			SegmentKey:     httputil.GetParam(ctx, rsc.SegmentKey),
			SegmentRuleKey: httputil.GetParam(ctx, rsc.RuleKey),
		},
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputil.Send(
		ctx,
		http.StatusNoContent,
		&res.Success{},
		http.StatusInternalServerError,
		e,
	)
}
