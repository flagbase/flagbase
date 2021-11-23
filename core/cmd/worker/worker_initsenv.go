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

// InitSenv Initialize server env
func InitSenv(ctx *cli.Context, wg *sync.WaitGroup) *srvenv.Env {
	senv, err := srv.Setup(srv.Config{
		Ctx:           context.Background(),
		PGConnStr:     ctx.String(cmdutil.PGConnStrFlag),
		RedisAddr:     ctx.String(cmdutil.RedisAddr),
		RedisPassword: ctx.String(cmdutil.RedisPassword),
		RedisDB:       int(ctx.Uint(cmdutil.RedisDB)),
		Verbose:       ctx.Bool(cmdutil.VerboseFlag),
	})
	if err != nil {
		log.Fatal("Unable to setup app context. Reason: ", err.Error())
	}
	return senv
}
