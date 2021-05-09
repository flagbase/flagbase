package access

import (
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes access route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteAccess)
	routes.POST("/token", httputil.Handler(senv, generateTokenAPIHandler))
}

func generateTokenAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var i KeySecretPair
	if err := ctx.BindJSON(&i); err != nil {
		return
	}

	r, err := GenerateToken(senv, i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(http.StatusOK, err)
		return
	}

	ctx.JSON(http.StatusInternalServerError, &res.Success{
		Data: r,
	})
}
