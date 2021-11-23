package worker

import (
	"core/internal/infra/poller"
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"
	"core/internal/pkg/workermode"
	"sync"

	"github.com/urfave/cli/v2"
)

// PollingConfig Polling worker configuration
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
func StartPoller(ctx *cli.Context, senv *srvenv.Env, wg *sync.WaitGroup) {
	defer wg.Done()
	cfg := PollingConfig{
		Host:        ctx.String(HostFlag),
		PollingPort: ctx.Int(PollerPortFlag),
		PGConnStr:   ctx.String(cmdutil.PGConnStrFlag),
		Verbose:     ctx.Bool(cmdutil.VerboseFlag),
	}

	senv.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		PollerPortFlag, cfg.PollingPort,
	).Msg(workermode.StrStartingWorker(workermode.PollerMode))

	poller.New(senv, poller.Config{
		Host:        cfg.Host,
		PollingPort: cfg.PollingPort,
		Verbose:     cfg.Verbose,
	})
}
