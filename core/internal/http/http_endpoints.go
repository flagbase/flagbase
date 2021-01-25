package http

import (
	"core/pkg/access"
	"core/pkg/environment"
	"core/pkg/flag"
	"core/pkg/identity"
	"core/pkg/ping"
	"core/pkg/project"
	"core/pkg/segment"
	"core/pkg/trait"
	"core/pkg/variation"
	"core/pkg/workspace"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(r *gin.Engine) {
	ApplyMetrics(r)
	root := r.Group("/")
	access.ApplyRoutes(root)
	environment.ApplyRoutes(root)
	flag.ApplyRoutes(root)
	identity.ApplyRoutes(root)
	ping.ApplyRoutes(root)
	project.ApplyRoutes(root)
	trait.ApplyRoutes(root)
	segment.ApplyRoutes(root)
	variation.ApplyRoutes(root)
	workspace.ApplyRoutes(root)
}
