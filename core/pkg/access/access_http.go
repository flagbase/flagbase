package access

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("access")
	routes.POST("/token", genAccessTokenHandler)
}

func genAccessTokenHandler(ctx *gin.Context) {
	var i PairInput
	ctx.BindJSON(&i)

	data, err := GenAccessToken(i)
	logrus.Info(err.Errors)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}
