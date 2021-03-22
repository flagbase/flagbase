package api

import (
	"core/internal/core/access"
	"core/internal/core/environment"
	"core/internal/core/flag"
	"core/internal/core/healthcheck"
	"core/internal/core/identity"
	"core/internal/core/project"
	"core/internal/core/segment"
	"core/internal/core/segmentrule"
	"core/internal/core/trait"
	"core/internal/core/variation"
	"core/internal/core/workspace"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(r *gin.Engine) {
	ApplyMetrics(r)
	root := r.Group("/")
	access.ApplyRoutes(root)
	environment.ApplyRoutes(root)
	flag.ApplyRoutes(root)
	healthcheck.ApplyRoutes(root)
	identity.ApplyRoutes(root)
	project.ApplyRoutes(root)
	trait.ApplyRoutes(root)
	segment.ApplyRoutes(root)
	segmentrule.ApplyRoutes(root)
	variation.ApplyRoutes(root)
	workspace.ApplyRoutes(root)
}
