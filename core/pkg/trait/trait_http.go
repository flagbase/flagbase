package trait

import (
	"core/internal/constants"
	"core/internal/httputils"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes trait route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("traits")
	routes.GET(":workspaceKey/:projectKey/:environmentKey", listHTTPHandler)
	routes.POST(":workspaceKey/:projectKey/:environmentKey", createHTTPHandler)
	routes.GET(":workspaceKey/:projectKey/:environmentKey/:traitKey", getHTTPHandler)
	routes.PATCH(":workspaceKey/:projectKey/:environmentKey/:traitKey", updateHTTPHandler)
	routes.DELETE(":workspaceKey/:projectKey/:environmentKey/:traitKey", deleteHTTPHandler)
}

func listHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	environmentKey := rsc.Key(ctx.Param("environmentKey"))

	data, _err := List(
		atk,
		workspaceKey,
		projectKey,
		environmentKey,
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 200, data, 500, e)
}

func createHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	environmentKey := rsc.Key(ctx.Param("environmentKey"))

	var i Trait
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Create(
		atk,
		i,
		workspaceKey,
		projectKey,
		environmentKey,
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 201, data, 500, e)
}

func getHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	environmentKey := rsc.Key(ctx.Param("environmentKey"))
	traitKey := rsc.Key(ctx.Param("traitKey"))

	data, _err := Get(
		atk,
		workspaceKey,
		projectKey,
		environmentKey,
		traitKey,
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 200, data, 500, e)
}

func updateHTTPHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	environmentKey := rsc.Key(ctx.Param("environmentKey"))
	traitKey := rsc.Key(ctx.Param("traitKey"))

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Update(
		atk,
		i,
		workspaceKey,
		projectKey,
		environmentKey,
		traitKey,
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 200, data, 500, e)
}

func deleteHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	environmentKey := rsc.Key(ctx.Param("environmentKey"))
	traitKey := rsc.Key(ctx.Param("traitKey"))

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	if err := Delete(
		atk,
		workspaceKey,
		projectKey,
		environmentKey,
		traitKey,
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(ctx, 204, &res.Success{}, 500, e)
}
