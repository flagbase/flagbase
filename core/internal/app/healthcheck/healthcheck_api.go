package healthcheck

import (
	"net/http"

	"core/internal/pkg/httputil"
	"core/internal/pkg/srvenv"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes healthcheck route handler
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	r.GET("healthcheck", httputil.Handler(senv, healthCheckAPIHandler))
}

func healthCheckAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	pong, err := HealthCheck(senv)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	ctx.Data(http.StatusOK, "text/plain", []byte(pong))
}
