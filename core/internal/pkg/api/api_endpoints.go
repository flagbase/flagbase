package api

import (
	"core/internal/app/access"
	"core/internal/app/environment"
	"core/internal/app/flag"
	"core/internal/app/healthcheck"
	"core/internal/app/identity"
	"core/internal/app/project"
	"core/internal/app/segment"
	"core/internal/app/segmentrule"
	"core/internal/app/trait"
	"core/internal/app/variation"
	"core/internal/app/workspace"
	"core/internal/pkg/appcontext"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(actx *appcontext.Ctx, r *gin.Engine) {
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
