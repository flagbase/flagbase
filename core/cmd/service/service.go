package service

import (
	"context"
	"log"
	"sync"

	srv "core/internal/infra/server"
	"core/internal/pkg/cmdutil"
	cons "core/internal/pkg/constants"

	"github.com/urfave/cli/v2"
)

const (
	// ModeFlag Type of worker (api, streamer)
	ModeFlag string = "mode"
	// HostFlag Server host address
	HostFlag string = "host"
	// APIPortFlag Port API will operate wihtin
	APIPortFlag string = "api-port"
	// StreamerPortFlag Port streamer will operate wihtin
	StreamerPortFlag string = "streamer-port"
	// PollingPortFlag Port streamer will operate wihtin
	PollerPortFlag string = "poller-port"
)

// Command service command entry
var Command cli.Command = cli.Command{
	Name:        "service",
	Usage:       "Manage service workers",
	Description: "Manage flagbase service workers (API, Streamer)",
	Subcommands: []*cli.Command{
		&StartCommand,
	},
}

// StartCommand service start command
var StartCommand cli.Command = cli.Command{
	Name:        "start",
	Usage:       "Start service workers",
	Description: "Manage flagbase service workers (API, Streamer, Polling)",
	Flags: append([]cli.Flag{
		&cli.StringFlag{
			Name:  ModeFlag,
			Usage: "Type of worker to run (i.e. all (default), api, streamer, polling)",
			Value: "all",
		},
		&cli.StringFlag{
			Name:  HostFlag,
			Usage: "Server host address",
			Value: "0.0.0.0",
		},
		&cli.IntFlag{
			Name:  APIPortFlag,
			Value: cons.DefaultAPIPort,
		},
		&cli.IntFlag{
			Name:  StreamerPortFlag,
			Value: cons.DefaultStreamerPort,
		},
		&cli.IntFlag{
			Name:  PollerPortFlag,
			Value: cons.DefaultPollingPort,
		},
	}, cmdutil.GlobalFlags...),
	Action: func(ctx *cli.Context) error {
		var wg sync.WaitGroup

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
		defer srv.Cleanup(senv)

		startAPI := func(wg *sync.WaitGroup) {
			defer wg.Done()
			StartAPI(senv, APIConfig{
				Host:          ctx.String(HostFlag),
				APIPort:       ctx.Int(APIPortFlag),
				PGConnStr:     ctx.String(cmdutil.PGConnStrFlag),
				RedisAddr:     ctx.String(cmdutil.RedisAddr),
				RedisPassword: ctx.String(cmdutil.RedisPassword),
				RedisDB:       int(ctx.Uint(cmdutil.RedisDB)),
				Verbose:       ctx.Bool(cmdutil.VerboseFlag),
			})
		}

		startSteamer := func(wg *sync.WaitGroup) {
			defer wg.Done()
			StartStreamer(senv, StreamerConfig{
				Host:         ctx.String(HostFlag),
				StreamerPort: ctx.Int(StreamerPortFlag),
				PGConnStr:    ctx.String(cmdutil.PGConnStrFlag),
				Verbose:      ctx.Bool(cmdutil.VerboseFlag),
			})
		}

		startPoller := func(wg *sync.WaitGroup) {
			defer wg.Done()
			StartPoller(senv, PollingConfig{
				Host:        ctx.String(HostFlag),
				PollingPort: ctx.Int(PollerPortFlag),
				PGConnStr:   ctx.String(cmdutil.PGConnStrFlag),
				Verbose:     ctx.Bool(cmdutil.VerboseFlag),
			})
		}

		switch mode := ctx.String("mode"); mode {
		case "all":
			wg.Add(1)
			go startAPI(&wg)
			wg.Add(1)
			go startSteamer(&wg)
			wg.Add(1)
			go startPoller(&wg)
			wg.Wait()
		case "api":
			wg.Add(1)
			startAPI(&wg)
		case "streamer":
			wg.Add(1)
			startSteamer(&wg)
		case "poller":
			wg.Add(1)
			startPoller(&wg)
		default:
			log.Fatal("Unknown mode '", mode, "'. Please choose either `api` OR `streamer`")
		}
		return nil
	},
}
