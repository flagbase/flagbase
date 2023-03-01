package worker

import (
	"context"
	"log"
	"sync"

	srv "core/internal/infra/server"
	"core/internal/pkg/cmdutil"
	"core/internal/pkg/srvenv"

	"github.com/urfave/cli/v2"
)

// Setup Initialize server env
func Setup(ctx *cli.Context, wg *sync.WaitGroup) *srvenv.Env {
	senv, err := srv.Setup(srv.Config{
		Ctx:           context.Background(),
		PGConnStr:     ctx.String(cmdutil.PGConnStrFlag),
		RedisAddr:     ctx.String(cmdutil.RedisAddrFlag),
		RedisPassword: ctx.String(cmdutil.RedisPasswordFlag),
		RedisDB:       int(ctx.Uint(cmdutil.RedisDBFlag)),
		Verbose:       ctx.Bool(cmdutil.VerboseFlag),
	})
	if err != nil {
		log.Fatal("Unable to setup app context. Reason: ", err.Error())
	}
	return senv
}
