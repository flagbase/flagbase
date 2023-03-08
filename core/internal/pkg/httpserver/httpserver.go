package httpserver

import (
	"core/internal/pkg/srvenv"
	"io"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	ginlogger "github.com/gin-contrib/logger"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

// Config API server configuration
type Config struct {
	Host     string
	HTTPPort int
	Verbose  bool
}

// New initialize a new gin-based HTTP server
func New(
	senv *srvenv.Env,
	cfg Config,
	applyRoutes func(*srvenv.Env, *gin.Engine),
) {
	if !cfg.Verbose {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowCredentials = true
	config.AllowWildcard = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"*"}
	config.ExposeHeaders = []string{"*"}

	r.Use(cors.New(config))

	r.Use(gin.Recovery())

	if cfg.Verbose {
		r.Use(
			ginlogger.SetLogger(
				ginlogger.WithLogger(
					func(_ *gin.Context, _ io.Writer, _ time.Duration) zerolog.Logger {
						return *senv.Log.Logger
					},
				),
				ginlogger.WithUTC(true),
			),
		)
	}

	applyRoutes(senv, r)

	err := r.Run(cfg.Host + ":" + strconv.Itoa(cfg.HTTPPort))
	if err != nil {
		senv.Log.Error().Str("reason", err.Error()).Msg("Unable to start HTTP server")
	}
}
