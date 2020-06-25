package workspace

import (
	"core/internal/patch"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("workspaces")
	routes.GET(":key", getWorkspaceHandler)
	routes.PATCH(":key", updateWorkspaceHandler)
	routes.DELETE(":key", deleteWorkspaceHandler)
	routes.POST("", createWorkspaceHandler)
	routes.GET("", listWorkspaceHandler)
}

// getWorkspaceHandler get workspace http handler
func getWorkspaceHandler(ctx *gin.Context) {
	key := ctx.Param("key")
	data, err := GetWorkspace(key)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}
	ctx.JSON(200, data)
}

// updateWorkspaceHandler update workspace http handler
func updateWorkspaceHandler(ctx *gin.Context) {
	key := ctx.Param("key")
	var i patch.Patch
	ctx.BindJSON(&i)

	data, err := UpdateWorkspace(key, i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}
	ctx.JSON(200, data)
}

// deleteWorkspaceHandler delete workspace http handler
func deleteWorkspaceHandler(ctx *gin.Context) {
	key := ctx.Param("key")
	err := DeleteWorkspace(key)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}
	ctx.Status(204)
}

// createWorkspaceHandler create workspace http handler
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

// listWorkspaceHandler list workspace http handler
func listWorkspaceHandler(ctx *gin.Context) {
	data, err := ListWorkspaces()
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}
	ctx.JSON(200, data)
}
