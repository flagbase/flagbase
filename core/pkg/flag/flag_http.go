package flag

import (
	cons "core/internal/constants"
	"core/internal/httputils"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes flag route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("flags")
	routes.GET(":workspaceKey/:projectKey", listHTTPHandler)
	routes.POST(":workspaceKey/:projectKey", createHTTPHandler)
	routes.GET(":workspaceKey/:projectKey/:flagKey", getHTTPHandler)
	routes.PATCH(":workspaceKey/:projectKey/:flagKey", updateHTTPHandler)
	routes.DELETE(":workspaceKey/:projectKey/:flagKey", deleteHTTPHandler)
}

func listHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.AuthError, err.Error())
	}

	data, _err := List(
		atk,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
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

func createHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.AuthError, err.Error())
	}

	var i Flag
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.InternalError, err.Error())
	}

	data, _err := Create(
		atk,
		i,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
	)
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

func getHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.AuthError, err.Error())
	}

	data, _err := Get(
		atk,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
		rsc.Key(ctx.Param("flagKey")),
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

func updateHTTPHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.AuthError, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.InternalError, err.Error())
	}

	data, _err := Update(
		atk,
		i,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
		rsc.Key(ctx.Param("flagKey")),
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

func deleteHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.AuthError, err.Error())
	}

	if err := Delete(
		atk,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
		rsc.Key(ctx.Param("flagKey")),
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
