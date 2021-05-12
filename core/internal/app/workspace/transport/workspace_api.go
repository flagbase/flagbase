package transport

import (
	workspacemodel "core/internal/app/workspace/model"
	workspaceservice "core/internal/app/workspace/service"
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
	Senv             *srvenv.Env
	WorkspaceService *workspaceservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:             senv,
		WorkspaceService: workspaceservice.NewService(senv),
	}
}

// ApplyRoutes workspace route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group(rsc.RouteWorkspace)
	resourcePath := httputil.BuildPath(
		rsc.WorkspaceKey,
	)

	routes.GET("", h.listAPIHandler)
	routes.POST("", h.createAPIHandler)
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

	r, _err := h.WorkspaceService.List(atk, workspacemodel.RootArgs{})
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

	var i workspacemodel.Workspace
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.WorkspaceService.Create(atk, i, workspacemodel.RootArgs{})
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

	r, _err := h.WorkspaceService.Get(
		atk,
		workspacemodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
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

	r, _err := h.WorkspaceService.Update(
		atk,
		i,
		workspacemodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
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

	if err := h.WorkspaceService.Delete(
		atk,
		workspacemodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
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
