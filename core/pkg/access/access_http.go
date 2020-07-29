package access

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("access")
	routes.POST("/token", generateTokenHTTPHandler)
}

func generateTokenHTTPHandler(ctx *gin.Context) {
	var i KeySecretPair
	ctx.BindJSON(&i)

	data, err := GenerateToken(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}
