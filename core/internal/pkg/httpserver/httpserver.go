package httpserver

import (
	srv "core/internal/infra/server"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
)

// Config API server configuration
type Config struct {
	Host     string
	HTTPPort int
	Verbose  bool
}

// New initialize a new gin-based HTTP server
func New(
	sctx *srv.Ctx,
	cfg Config,
	applyRoutes func(*srv.Ctx, *gin.Engine),
) {
	if !cfg.Verbose {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"*"},
		ExposeHeaders:   []string{"x-sdk-key", "Authorization", "ETag"},
	}))

	r.Use(gin.Recovery())

	if cfg.Verbose {
		r.Use(logger.SetLogger(logger.Config{
			Logger: sctx.Log.Logger,
			UTC:    true,
		}))
	}

	applyRoutes(sctx, r)

	err := r.Run(cfg.Host + ":" + strconv.Itoa(cfg.HTTPPort))
	if err != nil {
		sctx.Log.Error().Str("reason", err.Error()).Msg("Unable to start HTTP server")
	}
}
