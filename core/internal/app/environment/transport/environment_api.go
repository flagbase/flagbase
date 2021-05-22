package transport

import (
	environmentmodel "core/internal/app/environment/model"
	environmentservice "core/internal/app/environment/service"
	sdkkeytransport "core/internal/app/sdkkey/transport"
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
	EnvironmentService *environmentservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:               senv,
		EnvironmentService: environmentservice.NewService(senv),
	}
}

// ApplyRoutes environment route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group("/")
	rootPath := httputil.BuildRoute(
		httputil.BuildPath(
			rsc.WorkspaceKey,
			rsc.ProjectKey,
		),
		rsc.RouteEnvironment,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.EnvironmentKey,
	)

	routes.GET(rootPath, h.listAPIHandler)
	routes.POST(rootPath, h.createAPIHandler)
	routes.GET(resourcePath, h.getAPIHandler)
	routes.PATCH(resourcePath, h.updateAPIHandler)
	routes.DELETE(resourcePath, h.deleteAPIHandler)
	sdkkeytransport.ApplyRoutes(senv, routes)
}

func (h *APIHandler) listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := h.EnvironmentService.List(
		atk,
		environmentmodel.RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.SendJSON(
		ctx,
		http.StatusOK,
		r,
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

	var i environmentmodel.Environment
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.EnvironmentService.Create(
		atk,
		i,
		environmentmodel.RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.SendJSON(
		ctx,
		http.StatusCreated,
		r,
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

	r, _err := h.EnvironmentService.Get(
		atk,
		environmentmodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.SendJSON(
		ctx,
		http.StatusOK,
		r,
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

	r, _err := h.EnvironmentService.Update(
		atk,
		i,
		environmentmodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.SendJSON(
		ctx,
		http.StatusOK,
		r,
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

	if err := h.EnvironmentService.Delete(
		atk,
		environmentmodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
		},
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputil.SendJSON(
		ctx,
		http.StatusNoContent,
		&res.Success{},
		http.StatusInternalServerError,
		e,
	)
}
