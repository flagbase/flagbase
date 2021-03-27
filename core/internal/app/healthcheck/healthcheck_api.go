package healthcheck

import (
	"net/http"

	"core/internal/pkg/httputil"
	srv "core/internal/pkg/server"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes healthcheck route handler
func ApplyRoutes(sctx *srv.Ctx, r *gin.RouterGroup) {
	r.GET("healthcheck", httputil.Handler(sctx, healthCheckAPIHandler))
}

func healthCheckAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	pong, err := HealthCheck(sctx)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}
	ctx.Data(http.StatusOK, "text/plain", []byte(pong))
}
