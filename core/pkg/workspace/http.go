package workspace

import (
	"core/internal/constants"
	"core/internal/httputils"
	"core/internal/patch"
	rsc "core/internal/resource"
	res "core/internal/response"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("workspaces")
	routes.POST("", createHTTPHandler)
	routes.GET(":key", getHTTPHandler)
	routes.PATCH(":key", updateHTTPHandler)
	routes.DELETE(":key", deleteHTTPHandler)
	routes.GET("", listHTTPHandler)
}

func createHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	var i Workspace
	ctx.BindJSON(&i)

	data, _err := Create(atk, i)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	if !e.IsEmpty() {
		ctx.AbortWithStatusJSON(500, e)
		return
	}
	ctx.JSON(201, data)
}

func getHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	key := rsc.Key(ctx.Param("key"))

	data, _err := Get(atk, key)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	if !e.IsEmpty() {
		ctx.AbortWithStatusJSON(500, e)
		return
	}
	ctx.JSON(200, data)
}

func updateHTTPHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	key := rsc.Key(ctx.Param("key"))
	ctx.BindJSON(&i)

	data, _err := Update(atk, key, i)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	if !e.IsEmpty() {
		ctx.AbortWithStatusJSON(500, e)
		return
	}
	ctx.JSON(200, data)
}

func deleteHTTPHandler(ctx *gin.Context) {
	var e res.Errors
	key := rsc.Key(ctx.Param("key"))

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(constants.AuthError, err.Error())
	}

	if err := Delete(atk, key); !err.IsEmpty() {
		e.Extend(err)
	}

	if !e.IsEmpty() {
		ctx.AbortWithStatusJSON(500, e)
		return
	}
	ctx.Status(204)
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

	if !e.IsEmpty() {
		ctx.AbortWithStatusJSON(500, e)
		return
	}
	ctx.JSON(200, data)
}
