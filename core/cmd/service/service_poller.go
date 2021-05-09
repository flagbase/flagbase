package service

import (
	"core/internal/infra/poller"
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"
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
func StartPoller(senv *srvenv.Env, cfg PollingConfig) {
	senv.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		PollerPortFlag, cfg.PollingPort,
	).Msg("Starting Polling Service")

	poller.New(senv, poller.Config{
		Host:        cfg.Host,
		PollingPort: cfg.PollingPort,
		Verbose:     cfg.Verbose,
	})
}
