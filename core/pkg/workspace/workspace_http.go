package workspace

import (
	"core/internal/constants"
	"core/internal/httputils"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("workspaces")
	routes.GET("", listHTTPHandler)
	routes.POST("", createHTTPHandler)
	routes.GET(":workspaceKey", getHTTPHandler)
	routes.PATCH(":workspaceKey", updateHTTPHandler)
	routes.DELETE(":workspaceKey", deleteHTTPHandler)
}

func listHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	data, _err := List(atk)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, http.StatusOK, data, http.StatusInternalServerError, e)
}

func createHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	var i Workspace
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Create(atk, i)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 201, data, http.StatusInternalServerError, e)
}

func getHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	data, _err := Get(
		atk,
		rsc.Key(ctx.Param("workspaceKey")),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, http.StatusOK, data, http.StatusInternalServerError, e)
}

func updateHTTPHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Update(
		atk,
		i,
		rsc.Key(ctx.Param("workspaceKey")),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, http.StatusOK, data, http.StatusInternalServerError, e)
}

func deleteHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	if err := Delete(
		atk,
		rsc.Key(ctx.Param("workspaceKey")),
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(ctx, 204, &res.Success{}, http.StatusInternalServerError, e)
}
