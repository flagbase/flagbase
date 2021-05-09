package httputil

import (
	"core/internal/pkg/srvenv"

	"github.com/gin-gonic/gin"
)

// TODO REMOVE
// Handler passes the server context into a HTTP handler fn
func Handler(
	senv *srvenv.Env,
	handleFn func(*srvenv.Env, *gin.Context),
) func(gctx *gin.Context) {
	return func(gctx *gin.Context) {
		handleFn(senv, gctx)
	}
}
