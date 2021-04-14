package service

import (
	"core/internal/pkg/cmdutil"

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
	sctx.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		StreamerPortFlag, cfg.StreamerPort,
	).Msg("Starting Streamer Service")

	sctx.Log.Warn().Msg("Streamer has not been implemented yet.")
}
