package api

import (
	"core/internal/pkg/appcontext"
	"strconv"

	"github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
)

type Config struct {
	Host    string
	APIPort int
	Verbose bool
}

// New initialize a new gin-based HTTP server
func New(actx *appcontext.Ctx, cfg Config) {
	if !cfg.Verbose {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	if cfg.Verbose {
		r.Use(logger.SetLogger(logger.Config{
			Logger: actx.Log.Logger,
		}))
	}

	ApplyRoutes(actx, r)

	err := r.Run(cfg.Host + ":" + strconv.Itoa(cfg.APIPort))
	if err != nil {
		actx.Log.Error.Str("reason", err.Error()).Msg("Unable to start HTTP server")
	}
}
