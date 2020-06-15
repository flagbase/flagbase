package workspace

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("workspace")
	routes.GET(":key", getWorkspaceHandler)
}

func getWorkspaceHandler(ctx *gin.Context) {
	key := ctx.Param("key")
	data, err := GetWorkspace(ctx, key)
	if err != nil {
		ctx.AbortWithStatusJSON(404, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"data": data})
}
