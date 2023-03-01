package worker

import (
	"core/internal/infra/api"
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"
	"core/internal/pkg/workermode"
	"sync"

	"github.com/urfave/cli/v2"
)

// APIConfig API worker configuration
type APIConfig struct {
	Host          string
	APIPort       int
	Verbose       bool
	PGConnStr     string
	RedisAddr     string
	RedisPassword string
	RedisDB       int
}

// StartAPI Start API worker
func StartAPI(ctx *cli.Context, senv *srvenv.Env, wg *sync.WaitGroup) {
	defer wg.Done()
	cfg := APIConfig{
		Host:          ctx.String(HostFlag),
		APIPort:       ctx.Int(APIPortFlag),
		PGConnStr:     ctx.String(cmdutil.PGConnStrFlag),
		RedisAddr:     ctx.String(cmdutil.RedisAddrFlag),
		RedisPassword: ctx.String(cmdutil.RedisPasswordFlag),
		RedisDB:       int(ctx.Uint(cmdutil.RedisDBFlag)),
		Verbose:       ctx.Bool(cmdutil.VerboseFlag),
	}

	senv.Log.Info().Str(
		HostFlag, cfg.Host,
	).Bool(
		cmdutil.VerboseFlag, cfg.Verbose,
	).Int(
		APIPortFlag, cfg.APIPort,
	).Msg(workermode.StrStartingWorker(workermode.APIMode))

	api.New(senv, api.Config{
		Host:    cfg.Host,
		APIPort: cfg.APIPort,
		Verbose: cfg.Verbose,
	})
}
