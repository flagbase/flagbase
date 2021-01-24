package variation

import (
	"core/internal/constants"
	"core/internal/httputils"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes variation route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("variations")
	routes.GET(":workspaceKey/:projectKey/:flagKey", listHTTPHandler)
	routes.POST(":workspaceKey/:projectKey/:flagKey", createHTTPHandler)
	routes.GET(":workspaceKey/:projectKey/:flagKey/:variationKey", getHTTPHandler)
	routes.PATCH(":workspaceKey/:projectKey/:flagKey/:variationKey", updateHTTPHandler)
	routes.DELETE(":workspaceKey/:projectKey/:flagKey/:variationKey", deleteHTTPHandler)
}

func listHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	flagKey := rsc.Key(ctx.Param("flagKey"))

	data, _err := List(atk, workspaceKey, projectKey, flagKey)
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
	flagKey := rsc.Key(ctx.Param("flagKey"))

	var i Variation
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Create(atk, i, workspaceKey, projectKey, flagKey)
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
	flagKey := rsc.Key(ctx.Param("flagKey"))
	variationKey := rsc.Key(ctx.Param("variationKey"))

	data, _err := Get(atk, workspaceKey, projectKey, flagKey, variationKey)
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
	flagKey := rsc.Key(ctx.Param("flagKey"))
	variationKey := rsc.Key(ctx.Param("variationKey"))

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Update(atk, i, workspaceKey, projectKey, flagKey, variationKey)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 200, data, 500, e)
}

func deleteHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	flagKey := rsc.Key(ctx.Param("flagKey"))
	variationKey := rsc.Key(ctx.Param("variationKey"))

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	if err := Delete(atk, workspaceKey, projectKey, flagKey, variationKey); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(ctx, 204, &res.Success{}, 500, e)
}
