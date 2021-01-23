package identity

import (
	"core/internal/constants"
	"core/internal/httputils"
	rsc "core/internal/resource"
	res "core/internal/response"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes environment route handlers
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

func getHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	workspaceKey := rsc.Key(ctx.Param("workspaceKey"))
	projectKey := rsc.Key(ctx.Param("projectKey"))
	environmentKey := rsc.Key(ctx.Param("environmentKey"))
	identityKey := rsc.Key(ctx.Param("identityKey"))

	data, _err := Get(
		atk,
		workspaceKey,
		projectKey,
		environmentKey,
		identityKey,
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
	identityKey := rsc.Key(ctx.Param("identityKey"))

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	if err := Delete(
		atk,
		workspaceKey,
		projectKey,
		environmentKey,
		identityKey,
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(ctx, 204, &res.Success{}, 500, e)
}
