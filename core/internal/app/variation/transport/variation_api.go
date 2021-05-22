package transport

import (
	variationmodel "core/internal/app/variation/model"
	variationservice "core/internal/app/variation/service"
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
	VariationService *variationservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:             senv,
		VariationService: variationservice.NewService(senv),
	}
}

// ApplyRoutes variation route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group("/")
	rootPath := httputil.AppendRoute(
		httputil.BuildPath(
			rsc.WorkspaceKey,
			rsc.ProjectKey,
			rsc.FlagKey,
		),
		rsc.RouteVariation,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.VariationKey,
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

	r, _err := h.VariationService.List(
		atk,
		variationmodel.RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			FlagKey:      httputil.GetParam(ctx, rsc.FlagKey),
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

	var i variationmodel.Variation
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.VariationService.Create(
		atk,
		i,
		variationmodel.RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			FlagKey:      httputil.GetParam(ctx, rsc.FlagKey),
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

	r, _err := h.VariationService.Get(
		atk,
		variationmodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			FlagKey:      httputil.GetParam(ctx, rsc.FlagKey),
			VariationKey: httputil.GetParam(ctx, rsc.VariationKey),
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

	r, _err := h.VariationService.Update(
		atk,
		i,
		variationmodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			FlagKey:      httputil.GetParam(ctx, rsc.FlagKey),
			VariationKey: httputil.GetParam(ctx, rsc.VariationKey),
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

	if err := h.VariationService.Delete(
		atk,
		variationmodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			FlagKey:      httputil.GetParam(ctx, rsc.FlagKey),
			VariationKey: httputil.GetParam(ctx, rsc.VariationKey),
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
