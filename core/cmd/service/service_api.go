package service

import (
	"core/internal/infra/api"
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"
)

// APIConfig API service configuration
type APIConfig struct {
	Host          string
	APIPort       int
	Verbose       bool
	PGConnStr     string
	RedisAddr     string
	RedisPassword string
	RedisDB       int
}

// StartAPI start API
func StartAPI(senv *srvenv.Env, cfg APIConfig) {
	senv.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		APIPortFlag, cfg.APIPort,
	).Msg("Starting API Service")

	api.New(senv, api.Config{
		Host:    cfg.Host,
		APIPort: cfg.APIPort,
		Verbose: cfg.Verbose,
	})
}
