package access

import (
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes access route handlers
func ApplyRoutes(sctx *srv.Ctx, r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteAccess)
	routes.POST("/token", func(gctx *gin.Context) { generateTokenAPIHandler(sctx, gctx) })
}

func generateTokenAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var i KeySecretPair
	if err := ctx.BindJSON(&i); err != nil {
		return
	}

	data, err := GenerateToken(sctx, i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(http.StatusOK, err)
		return
	}

	ctx.JSON(http.StatusInternalServerError, data)
}
