package transport

import (
	accessmodel "core/internal/app/access/model"
	accessservice "core/internal/app/access/service"
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
	AccessService *accessservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:          senv,
		AccessService: accessservice.NewService(senv),
	}
}

// ApplyRoutes access route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group(rsc.RouteAccess)
	resourcePath := httputil.BuildPath(
		rsc.AccessKey,
	)

	routes.POST("/token", h.generateTokenAPIHandler)
	routes.GET("", h.listAPIHandler)
	routes.POST("", h.createAPIHandler)
	routes.GET(resourcePath, h.getAPIHandler)
	routes.PATCH(resourcePath, h.updateAPIHandler)
	routes.DELETE(resourcePath, h.deleteAPIHandler)
}

func (h *APIHandler) generateTokenAPIHandler(ctx *gin.Context) {
	var i accessmodel.KeySecretPair
	if err := ctx.BindJSON(&i); err != nil {
		return
	}

	r, err := h.AccessService.GenerateToken(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, &res.Success{
		Data: r,
	})
}

func (h *APIHandler) listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := h.AccessService.List(atk, accessmodel.RootArgs{})
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

	var i accessmodel.Access
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.AccessService.Create(atk, i, accessmodel.RootArgs{})
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

	r, _err := h.AccessService.Get(
		atk,
		accessmodel.ResourceArgs{
			AccessKey: httputil.GetParam(ctx, rsc.AccessKey),
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

	r, _err := h.AccessService.Update(
		atk,
		i,
		accessmodel.ResourceArgs{
			AccessKey: httputil.GetParam(ctx, rsc.AccessKey),
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

	if err := h.AccessService.Delete(
		atk,
		accessmodel.ResourceArgs{
			AccessKey: httputil.GetParam(ctx, rsc.AccessKey),
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
