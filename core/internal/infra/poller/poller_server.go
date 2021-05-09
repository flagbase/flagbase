package poller

import (
	"core/internal/pkg/httpserver"
	"core/internal/pkg/srvenv"
)

// Config polling server configuration
type Config struct {
	Host        string
	PollingPort int
	Verbose     bool
}

// New initialize a new HTTP server for polling
func New(senv *srvenv.Env, cfg Config) {
	httpserver.New(senv, httpserver.Config{
		Host:     cfg.Host,
		HTTPPort: cfg.PollingPort,
		Verbose:  cfg.Verbose,
	}, ApplyRoutes)
}
