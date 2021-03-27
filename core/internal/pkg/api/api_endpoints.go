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
	srv "core/internal/pkg/server"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(sctx *srv.Ctx, r *gin.Engine) {
	ApplyMetrics(r)
	root := r.Group("/")
	access.ApplyRoutes(sctx, root)
	environment.ApplyRoutes(root)
	flag.ApplyRoutes(root)
	healthcheck.ApplyRoutes(root)
	identity.ApplyRoutes(root)
	project.ApplyRoutes(root)
	trait.ApplyRoutes(root)
	segment.ApplyRoutes(root)
	segmentrule.ApplyRoutes(root)
	variation.ApplyRoutes(root)
	workspace.ApplyRoutes(sctx, root)
}
