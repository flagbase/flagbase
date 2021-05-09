package api

import (
	"core/internal/app/access"
	"core/internal/app/evaluation"
	"core/internal/app/flag"
	"core/internal/app/healthcheck"
	"core/internal/app/identity"
	"core/internal/app/project"
	"core/internal/app/segment"
	"core/internal/app/targeting"
	"core/internal/app/trait"
	"core/internal/app/workspace"
	srv "core/internal/infra/server"
	"core/internal/pkg/httpmetrics"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(sctx *srv.Ctx, r *gin.Engine) {
	httpmetrics.ApplyMetrics(r, "api")
	root := r.Group("/")
	access.ApplyRoutes(sctx, root)
	flag.ApplyRoutes(sctx, root)
	evaluation.ApplyRoutes(sctx, root)
	healthcheck.ApplyRoutes(sctx, root)
	identity.ApplyRoutes(sctx, root)
	project.ApplyRoutes(sctx, root)
	targeting.ApplyRoutes(sctx, root)
	trait.ApplyRoutes(sctx, root)
	segment.ApplyRoutes(sctx, root)
	workspace.ApplyRoutes(sctx, root)
}
