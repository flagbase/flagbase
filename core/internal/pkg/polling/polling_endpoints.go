package polling

import (
	"core/internal/pkg/httpmetrics"
	"core/internal/pkg/httputil"
	srv "core/internal/pkg/server"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(sctx *srv.Ctx, r *gin.Engine) {
	httpmetrics.ApplyMetrics(r, "polling")
	routes := r.Group("")
	routes.GET("/flags/raw", httputil.Handler(sctx, getRawFlags))
	routes.POST("/flags/evaluated", httputil.Handler(sctx, evaluateFlags))
}

func getRawFlags(sctx *srv.Ctx, ctx *gin.Context) {
	// TODO (OSS-81)
}

func evaluateFlags(sctx *srv.Ctx, ctx *gin.Context) {
	// TODO (OSS-81)
}
