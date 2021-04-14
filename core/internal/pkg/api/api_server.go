package api

import (
	"core/internal/pkg/httpserver"
	srv "core/internal/pkg/server"
)

// Config API server configuration
type Config struct {
	Host    string
	APIPort int
	Verbose bool
}

// New initialize a new gin-based HTTP server
func New(sctx *srv.Ctx, cfg Config) {
	httpserver.New(sctx, httpserver.Config{
		Host:     cfg.Host,
		HTTPPort: cfg.APIPort,
		Verbose:  cfg.Verbose,
	}, ApplyRoutes)
}
