package ping

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes ping route handler
func ApplyRoutes(r *gin.RouterGroup) {
	r.GET("ping", pingHTTPHandler)
}

func pingHTTPHandler(ctx *gin.Context) {
	pong, err := Ping(ctx)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	ctx.Data(http.StatusOK, "text/plain", []byte(pong))
}
