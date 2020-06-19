package http

import (
	"core/pkg/access"
	"core/pkg/ping"
	"core/pkg/workspace"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(r *gin.Engine) {
	root := r.Group("/")
	access.ApplyRoutes(root)
	ping.ApplyRoutes(root)
	workspace.ApplyRoutes(root)
}
