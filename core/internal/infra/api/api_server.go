package api

import (
	"core/internal/pkg/httpserver"
	"core/internal/pkg/srvenv"
)

// Config API server configuration
type Config struct {
	Host    string
	APIPort int
	Verbose bool
}

// New initialize a new HTTP server for the API
func New(senv *srvenv.Env, cfg Config) {
	httpserver.New(senv, httpserver.Config{
		Host:     cfg.Host,
		HTTPPort: cfg.APIPort,
		Verbose:  cfg.Verbose,
	}, ApplyRoutes)
}
