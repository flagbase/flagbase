package httputils

import (
	rsc "core/internal/pkg/resource"

	"github.com/gin-gonic/gin"
)

// GetParam retrieves path from a route context
func GetParam(ctx *gin.Context, pathParam rsc.Key) rsc.Key {
	return rsc.Key(ctx.Param(pathParam.String()))
}

// BuildPath constructs a path given the respective param keys
func BuildPath(params ...rsc.Key) string {
	if len(params) == 1 {
		return ":" + params[0].String()
	}

	return ":" + params[0].String() + "/" + BuildPath(params[1:]...)
}

// AppendPath helper which appends extra param keys to an existing path
func AppendPath(rootPath string, params ...rsc.Key) string {
	return rootPath + "/" + BuildPath(
		params...,
	)
}
