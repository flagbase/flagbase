package ping

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes ping route handler
func ApplyRoutes(r *gin.RouterGroup) {
	r.GET("ping", pingHTTPHandler)
}

func pingHTTPHandler(ctx *gin.Context) {
	pong, err := Ping(ctx)
	if err != nil {
		ctx.AbortWithStatus(500)
		return
	}
	ctx.Data(200, "text/plain", []byte(pong))
}
