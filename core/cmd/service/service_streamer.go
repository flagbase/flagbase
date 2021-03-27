package service

import (
	srv "core/internal/pkg/server"
)

// StreamerConfig API service configuration
type StreamerConfig struct {
	Host         string
	StreamerPort int
	PGConnStr    string
	Verbose      bool
}

// StartStreamer start streamer
func StartStreamer(sctx *srv.Ctx, cfg StreamerConfig) {
	sctx.Log.Info.Str(
		"host", cfg.Host,
	).Bool(
		"verbose", cfg.Verbose,
	).Int(
		"streamerPort", cfg.StreamerPort,
	).Msg("Starting API")

	sctx.Log.Warn.Msg("Streamer has not been implemented yet.")
}
