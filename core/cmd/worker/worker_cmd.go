package worker

import (
	"fmt"
	"log"
	"sync"

	srv "core/internal/infra/server"
	"core/internal/pkg/cmdutil"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/srvenv"
	"core/internal/pkg/workermode"

	"github.com/urfave/cli/v2"
)

const (
	// ModeFlag Type of worker (api, graphql, streamer, poller)
	ModeFlag string = "mode"
	// HostFlag Server host address
	HostFlag string = "host"
	// APIPortFlag Port API will operate within
	APIPortFlag string = "api-port"
	// StreamerPortFlag Port streamer will operate within
	StreamerPortFlag string = "streamer-port"
	// PollingPortFlag Port streamer will operate within
	PollerPortFlag string = "poller-port"
)

// Command worker command entry
var Command cli.Command = cli.Command{
	Name:        "worker",
	Usage:       "Manage workers",
	Description: fmt.Sprintf("Manage flagbase workers (i.e. %s)", workermode.StrListModes()),
	Subcommands: []*cli.Command{
		&StartCommand,
	},
}

// StartCommand service start command
var StartCommand cli.Command = cli.Command{
	Name:        "start",
	Usage:       "Start worker",
	Description: fmt.Sprintf("Start flagbase workers (i.e. %s)", workermode.StrListModes()),
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
	Action: startCommand,
}

func startCommand(ctx *cli.Context) error {
	var wg sync.WaitGroup
	var senv *srvenv.Env
	defer srv.Cleanup(senv)

	switch mode := ctx.String("mode"); mode {
	case string(workermode.AllMode):
		wg.Add(1)
		senv = Setup(ctx, &wg)
		wg.Add(1)
		go StartAPI(ctx, senv, &wg)
		wg.Add(1)
		go StartSteamer(ctx, senv, &wg)
		wg.Add(1)
		go StartPoller(ctx, senv, &wg)
		wg.Wait()
	case string(workermode.APIMode):
		wg.Add(1)
		senv = Setup(ctx, &wg)
		wg.Add(1)
		StartAPI(ctx, senv, &wg)
	case string(workermode.StreamerMode):
		wg.Add(1)
		senv = Setup(ctx, &wg)
		wg.Add(1)
		StartSteamer(ctx, senv, &wg)
	case string(workermode.PollerMode):
		wg.Add(1)
		senv = Setup(ctx, &wg)
		wg.Add(1)
		StartPoller(ctx, senv, &wg)
	default:
		log.Fatal(
			fmt.Sprintf(
				"Unknown mode '%s'. Please choose either one of these: %s",
				mode,
				workermode.StrListModes(),
			),
		)
	}
	return nil
}
