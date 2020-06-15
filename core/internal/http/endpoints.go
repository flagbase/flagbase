package http

import (
	"core/pkg/ping"
	"core/pkg/workspace"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(r *gin.Engine) {
	root := r.Group("/")
	ping.ApplyRoutes(root)
	workspace.ApplyRoutes(root)
}
