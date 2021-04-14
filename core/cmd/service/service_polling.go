package service

import (
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/polling"

	srv "core/internal/pkg/server"
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
func StartPolling(sctx *srv.Ctx, cfg PollingConfig) {
	sctx.Log.Logger.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		PollingPortFlag, cfg.PollingPort,
	).Msg("Starting Polling Service")

	polling.New(sctx, polling.Config{
		Host:        cfg.Host,
		PollingPort: cfg.PollingPort,
		Verbose:     cfg.Verbose,
	})
}
