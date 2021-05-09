package service

import (
	"core/internal/infra/poller"
	"core/internal/pkg/cmdutil"

	srv "core/internal/infra/server"
)

// PollingConfig Polling service configuration
type PollingConfig struct {
	Host          string
	PollingPort   int
	Verbose       bool
	PGConnStr     string
	RedisAddr     string
	RedisPassword string
	RedisDB       int
}

// StartPolling start polling
func StartPoller(sctx *srv.Ctx, cfg PollingConfig) {
	sctx.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		PollerPortFlag, cfg.PollingPort,
	).Msg("Starting Polling Service")

	poller.New(sctx, poller.Config{
		Host:        cfg.Host,
		PollingPort: cfg.PollingPort,
		Verbose:     cfg.Verbose,
	})
}
