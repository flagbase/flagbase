package workspace

import (
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/pkg/httputils"
	"core/pkg/patch"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteWorkspace)
	resourcePath := httputils.BuildPath(
		rsc.WorkspaceKey,
	)

	routes.GET("", listAPIHandler)
	routes.POST("", createAPIHandler)
	routes.GET(resourcePath, getAPIHandler)
	routes.PATCH(resourcePath, updateAPIHandler)
	routes.DELETE(resourcePath, deleteAPIHandler)
}

func listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := List(atk)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func createAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i Workspace
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Create(atk, i)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(
		ctx,
		http.StatusCreated,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func getAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := Get(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func updateAPIHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Update(
		atk,
		i,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func deleteAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := Delete(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(
		ctx,
		http.StatusNoContent,
		&res.Success{},
		http.StatusInternalServerError,
		e,
	)
}
