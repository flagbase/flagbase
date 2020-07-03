package access

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("access")
	routes.POST("/token", genAccessTokenHandler)
}

func genAccessTokenHandler(ctx *gin.Context) {
	var i KeySecretPair
	ctx.BindJSON(&i)

	data, err := GenAccessToken(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}
