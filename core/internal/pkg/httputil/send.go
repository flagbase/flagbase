package httputil

import (
	res "core/pkg/response"

	"github.com/gin-gonic/gin"
)

// Send standard http response
func Send(
	ctx *gin.Context,
	successCode int,
	data *res.Success,
	errorCode int,
	err res.Errors,
) {
	if !err.IsEmpty() {
		ctx.AbortWithStatusJSON(errorCode, err)
		return
	}
	ctx.JSON(successCode, data)
}
