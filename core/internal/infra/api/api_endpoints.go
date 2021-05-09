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
	"core/internal/pkg/httpmetrics"
	"core/internal/pkg/srvenv"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(senv *srvenv.Env, r *gin.Engine) {
	httpmetrics.ApplyMetrics(r, "api")
	root := r.Group("/")
	access.ApplyRoutes(senv, root)
	flag.ApplyRoutes(senv, root)
	evaluation.ApplyRoutes(senv, root)
	healthcheck.ApplyRoutes(senv, root)
	identity.ApplyRoutes(senv, root)
	project.ApplyRoutes(senv, root)
	targeting.ApplyRoutes(senv, root)
	trait.ApplyRoutes(senv, root)
	segment.ApplyRoutes(senv, root)
	workspace.ApplyRoutes(senv, root)
}
