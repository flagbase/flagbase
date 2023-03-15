package httputil

import (
	cons "core/internal/pkg/constants"
	res "core/pkg/response"

	"github.com/gin-gonic/gin"
	"github.com/google/jsonapi"
)

// SendJSON JSON:API http response marshal then send
func SendJSON(
	ctx *gin.Context,
	successCode int,
	data interface{},
	errorCode int,
	err res.Errors,
) {
	ctx.Header("Content-Type", jsonapi.MediaType)

	if !err.IsEmpty() {
		ctx.AbortWithStatusJSON(errorCode, err)
		return
	}

	// Check if status code is 304 Not Modified
	if ctx.Writer.Status() != 304 {
		if err := jsonapi.MarshalPayload(ctx.Writer, data); err != nil {
			ctx.AbortWithStatusJSON(errorCode, res.Errors{
				Errors: []*res.Error{
					{
						Code:    cons.ErrorInternal,
						Message: err.Error(),
					},
				},
			})
		}
	} else {
		ctx.Status(304)
	}
}
