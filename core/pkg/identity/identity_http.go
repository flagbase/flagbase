package identity

import (
	"core/internal/constants"
	"core/internal/httputils"
	rsc "core/internal/resource"
	res "core/internal/response"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes identity route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("identities")
	routes.GET(":workspaceKey/:projectKey/:environmentKey", listHTTPHandler)
	routes.GET(":workspaceKey/:projectKey/:environmentKey/:identityKey", getHTTPHandler)
	routes.DELETE(":workspaceKey/:projectKey/:environmentKey/:identityKey", deleteHTTPHandler)
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
		rsc.Key(ctx.Param("environmentKey")),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(ctx, 200, data, 500, e)
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
		rsc.Key(ctx.Param("environmentKey")),
		rsc.Key(ctx.Param("identityKey")),
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
		rsc.Key(ctx.Param("environmentKey")),
		rsc.Key(ctx.Param("identityKey")),
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(ctx, 204, &res.Success{}, 500, e)
}
