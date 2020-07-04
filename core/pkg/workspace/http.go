package workspace

import (
	"core/internal/httputils"
	"core/internal/patch"
	"core/internal/resource"

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

func getWorkspaceHandler(ctx *gin.Context) {
	atk := httputils.RetrieveAccessToken(ctx)
	key := resource.Key(ctx.Param("key"))

	data, err := GetWorkspace(atk, key)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}

func updateWorkspaceHandler(ctx *gin.Context) {
	key := resource.Key(ctx.Param("key"))
	var i patch.Patch
	ctx.BindJSON(&i)

	data, err := UpdateWorkspace(key, i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}

func deleteWorkspaceHandler(ctx *gin.Context) {
	key := ctx.Param("key")

	if err := DeleteWorkspace(key); err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.Status(204)
}

func createWorkspaceHandler(ctx *gin.Context) {
	atk := httputils.RetrieveAccessToken(ctx)

	var i Workspace
	ctx.BindJSON(&i)

	data, err := CreateWorkspace(atk, i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(201, data)
}

func listWorkspaceHandler(ctx *gin.Context) {
	data, err := ListWorkspaces()
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}
