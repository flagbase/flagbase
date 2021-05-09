package poller

import (
	srv "core/internal/infra/server"
	"core/internal/pkg/httpserver"
)

// Config polling server configuration
type Config struct {
	Host        string
	PollingPort int
	Verbose     bool
}

// New initialize a new HTTP server for polling
func New(sctx *srv.Ctx, cfg Config) {
	httpserver.New(sctx, httpserver.Config{
		Host:     cfg.Host,
		HTTPPort: cfg.PollingPort,
		Verbose:  cfg.Verbose,
	}, ApplyRoutes)
}
