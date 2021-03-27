package service

import (
	"core/internal/pkg/api"
	srv "core/internal/pkg/server"
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
	sctx.Log.Info.Str(
		"host", cfg.Host,
	).Bool(
		"verbose", cfg.Verbose,
	).Int(
		"apiPort", cfg.APIPort,
	).Msg("Starting API")

	api.New(sctx, api.Config{
		Host:    cfg.Host,
		APIPort: cfg.APIPort,
		Verbose: cfg.Verbose,
	})
}
