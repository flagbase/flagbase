package workspace

import (
	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("workspaces")
	routes.POST("", createWorkspaceHandler)
	routes.GET(":key", getWorkspaceHandler)
}

func createWorkspaceHandler(ctx *gin.Context) {
	var i Workspace
	ctx.BindJSON(&i)
	data, err := CreateWorkspace(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}
	ctx.JSON(201, data)
}

func getWorkspaceHandler(ctx *gin.Context) {
	key := ctx.Param("key")
	data, err := GetWorkspace(key)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}
	ctx.JSON(200, data)
}
