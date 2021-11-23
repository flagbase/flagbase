package worker

import (
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"
	"core/internal/pkg/workermode"
	"sync"

	"github.com/urfave/cli/v2"
)

// StreamerConfig API worker configuration
type StreamerConfig struct {
	Host         string
	StreamerPort int
	PGConnStr    string
	Verbose      bool
}

// StartStreamer start streamer worker
func StartSteamer(ctx *cli.Context, senv *srvenv.Env, wg *sync.WaitGroup) {
	defer wg.Done()
	cfg := StreamerConfig{
		Host:         ctx.String(HostFlag),
		StreamerPort: ctx.Int(StreamerPortFlag),
		PGConnStr:    ctx.String(cmdutil.PGConnStrFlag),
		Verbose:      ctx.Bool(cmdutil.VerboseFlag),
	}

	senv.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		StreamerPortFlag, cfg.StreamerPort,
	).Msg(workermode.StrStartingWorker(workermode.StreamerMode))

	senv.Log.Warn().Msg("Streamer has not been implemented yet.")
}
