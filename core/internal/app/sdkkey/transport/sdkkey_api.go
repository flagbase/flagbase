package sdkkey

import (
	sdkkeymodel "core/internal/app/sdkkey/model"
	sdkkeyservice "core/internal/app/sdkkey/service"
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
	Senv          *srvenv.Env
	SDKKeyService *sdkkeyservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:          senv,
		SDKKeyService: sdkkeyservice.NewService(senv),
	}
}

// ApplyRoutes identity route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group("/")
	rootPath := httputil.BuildRoute(
		httputil.AppendPath(
			httputil.AppendRoute(
				httputil.BuildPath(
					rsc.WorkspaceKey,
					rsc.ProjectKey,
				),
				rsc.RouteEnvironment,
			),
			rsc.EnvironmentKey,
		),
		rsc.RouteSDKKey,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.ResourceID,
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

	r, _err := h.SDKKeyService.List(
		atk,
		sdkkeymodel.RootArgs{
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

func (h *APIHandler) createAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i sdkkeymodel.SDKKey
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.SDKKeyService.Create(
		atk,
		i,
		sdkkeymodel.RootArgs{
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

	r, _err := h.SDKKeyService.Get(
		atk,
		sdkkeymodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			ID:             httputil.GetParam(ctx, rsc.ResourceID),
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

	r, _err := h.SDKKeyService.Update(
		atk,
		i,
		sdkkeymodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			ID:             httputil.GetParam(ctx, rsc.ResourceID),
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

	if err := h.SDKKeyService.Delete(
		atk,
		sdkkeymodel.ResourceArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
			ID:             httputil.GetParam(ctx, rsc.ResourceID),
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
