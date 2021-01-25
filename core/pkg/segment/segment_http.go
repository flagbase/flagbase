package segment

import (
	"core/internal/constants"
	"core/internal/httputils"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes segment route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("segments")
	routes.GET(":workspaceKey/:projectKey", listHTTPHandler)
	routes.POST(":workspaceKey/:projectKey", createHTTPHandler)
	routes.GET(":workspaceKey/:projectKey/:segmentKey", getHTTPHandler)
	routes.PATCH(":workspaceKey/:projectKey/:segmentKey", updateHTTPHandler)
	routes.DELETE(":workspaceKey/:projectKey/:segmentKey", deleteHTTPHandler)
}

func listHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	data, _err := List(
		atk,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
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

	var i Segment
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
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

	httputils.Send(ctx, 201, data, 500, e)
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
		rsc.Key(ctx.Param("projectKey")),
		rsc.Key(ctx.Param("segmentKey")),
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

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(constants.InternalError, err.Error())
	}

	data, _err := Update(
		atk,
		i,
		rsc.Key(ctx.Param("workspaceKey")),
		rsc.Key(ctx.Param("projectKey")),
		rsc.Key(ctx.Param("segmentKey")),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 200, data, 500, e)
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
		rsc.Key(ctx.Param("projectKey")),
		rsc.Key(ctx.Param("segmentKey")),
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(ctx, 204, &res.Success{}, 500, e)
}
