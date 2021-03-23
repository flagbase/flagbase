package healthcheck

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes healthcheck route handler
func ApplyRoutes(r *gin.RouterGroup) {
	r.GET("healthcheck", healthCheckAPIHandler)
}

func healthCheckAPIHandler(ctx *gin.Context) {
	pong, err := HealthCheck(ctx)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	ctx.Data(http.StatusOK, "text/plain", []byte(pong))
}
