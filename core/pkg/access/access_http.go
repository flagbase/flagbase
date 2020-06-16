package access

import (
	"core/generated/models"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("access")
	routes.POST("", createAccessHandler)
}

func createAccessHandler(ctx *gin.Context) {
	var i models.AccessInput
	ctx.BindJSON(&i)

	data, err := CreateAccess(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}
