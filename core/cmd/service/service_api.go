package service

import (
	"core/internal/infra/api"
	"core/internal/pkg/cmdutil"

	srv "core/internal/infra/server"
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
func StartAPI(sctx *srv.Ctx, cfg APIConfig) {
	sctx.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		APIPortFlag, cfg.APIPort,
	).Msg("Starting API Service")

	api.New(sctx, api.Config{
		Host:    cfg.Host,
		APIPort: cfg.APIPort,
		Verbose: cfg.Verbose,
	})
}
