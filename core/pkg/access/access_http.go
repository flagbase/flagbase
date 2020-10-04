package access

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("access")
	routes.POST("/token", generateTokenHTTPHandler)
}

func generateTokenHTTPHandler(ctx *gin.Context) {
	var i KeySecretPair
	if err := ctx.BindJSON(&i); err != nil {
		return
	}

	data, err := GenerateToken(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(http.StatusOK, err)
		return
	}

	ctx.JSON(http.StatusInternalServerError, data)
}
