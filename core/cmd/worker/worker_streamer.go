package worker

import (
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"
)

// StreamerConfig API worker configuration
type StreamerConfig struct {
	Host         string
	StreamerPort int
	PGConnStr    string
	Verbose      bool
}

// StartStreamer start streamer
func StartStreamer(senv *srvenv.Env, cfg StreamerConfig) {
	senv.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		StreamerPortFlag, cfg.StreamerPort,
	).Msg("Starting Streamer Worker")

	senv.Log.Warn().Msg("Streamer has not been implemented yet.")
}
