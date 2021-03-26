package service

import (
	"log"
	"sync"

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
	Description: "Manage flagbase service workers (API, Streamer)",
	Flags: append([]cli.Flag{
		&cli.StringFlag{
			Name:  ModeFlag,
			Usage: "Type of worker to run (i.e. all (default), api, streamer)",
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
	}, cmdutil.GlobalFlags...),
	Action: func(ctx *cli.Context) error {
		var wg sync.WaitGroup

		startAPI := func(wg *sync.WaitGroup) {
			defer wg.Done()
			StartAPI(APIConfig{
				Host:      ctx.String(HostFlag),
				APIPort:   ctx.Int(APIPortFlag),
				PGConnStr: ctx.String(cmdutil.PGConnStrFlag),
				Verbose:   ctx.Bool(cmdutil.VerboseFlag),
			})
		}

		startSteamer := func(wg *sync.WaitGroup) {
			defer wg.Done()
			StartStreamer(StreamerConfig{
				Host:         ctx.String(HostFlag),
				StreamerPort: ctx.Int(StreamerPortFlag),
				PGConnStr:    ctx.String(cmdutil.PGConnStrFlag),
				Verbose:      ctx.Bool(cmdutil.VerboseFlag),
			})
		}

		switch mode := ctx.String("mode"); mode {
		case "all":
			wg.Add(1)
			go startAPI(&wg)
			wg.Add(1)
			go startSteamer(&wg)
			wg.Wait()
		case "api":
			wg.Add(1)
			startAPI(&wg)
		case "streamer":
			wg.Add(1)
			startSteamer(&wg)
		default:
			log.Fatal("Unknown mode '", mode, "'. Please choose either `api` OR `streamer`")
		}
		return nil
	},
}
