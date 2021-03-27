package httputils

import (
	srv "core/internal/pkg/server"

	"github.com/gin-gonic/gin"
)

// Handler passes the server context into a HTTP handler fn
func Handler(
	sctx *srv.Ctx,
	handleFn func(sctx *srv.Ctx, ctx *gin.Context),
) func(gctx *gin.Context) {
	return func(gctx *gin.Context) {
		handleFn(sctx, gctx)
	}
}
