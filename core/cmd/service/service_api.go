package service

import (
	"context"
	"runtime"

	"core/internal/pkg/api"
	"core/internal/pkg/policy"
	srv "core/internal/pkg/server"
	"core/pkg/db"
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

	// TODO remove global db connection
	if err := db.NewPool(context.Background(), cfg.PGConnStr, cfg.Verbose); err != nil {
		sctx.Log.Error.Str(
			"reason", err.Error(),
		).Msg("Unable to connect to db")
		runtime.Goexit()
	}
	defer db.Pool.Close()

	// TODO remove global policy
	if err := policy.NewEnforcer(cfg.PGConnStr); err != nil {
		sctx.Log.Error.Str(
			"reason", err.Error(),
		).Msg("Unable to start enforcer")
		runtime.Goexit()
	}

	api.New(sctx, api.Config{
		Host:    cfg.Host,
		APIPort: cfg.APIPort,
		Verbose: cfg.Verbose,
	})
}
