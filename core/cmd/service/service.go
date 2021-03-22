package service

import (
	"log"
  "sync"

  cons "core/internal/pkg/constants"

  "github.com/urfave/cli/v2"
)

// ServiceCommand service command
var ServiceCommand cli.Command = cli.Command{
	Name:  "service",
	Usage: "Manage service workers",
	Description: "Manage flagbase service workers (API, Streamer)",
  Subcommands: []*cli.Command{
    &ServiceStartCommand,
  },
}

// ServiceStartCommand service start command
var ServiceStartCommand cli.Command = cli.Command{
	Name:  "start",
	Usage: "Start service workers",
	Description: "Manage flagbase service workers (API, Streamer)",
	ArgsUsage: "[arrgh]",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  "mode",
			Usage: "Specify workers (i.e. all (default), api, streamer)",
			Value: "all",
		},
    &cli.StringFlag{
			Name:  "host",
			Usage: "Server Host Address",
			Value: "0.0.0.0",
		},
		&cli.IntFlag{
			Name:  "http-port",
			Value: cons.DefaultHTTPPort,
		},
		&cli.IntFlag{
			Name:  "streamer-port",
			Value: cons.DefaultStreamerPort,
		},
    &cli.StringFlag{
			Name:  "db-url",
			Usage: "Postgres Connection URL",
			Value: cons.DefaultDBURL,
		},
		&cli.BoolFlag{
			Name:    "verbose",
			Aliases: []string{"v"},
			Usage:   "Enable logging to stdout",
			Value:   cons.DefaultVerbose,
		},
	},
	Action: func(ctx *cli.Context) error {
    var wg sync.WaitGroup

    startAPI := func (wg *sync.WaitGroup) {
      defer wg.Done()
      StartAPI(ServiceAPIConfig{
        Host:     ctx.String("host"),
        HTTPPort: ctx.Int("http-port"),
        DBURL:    ctx.String("db-url"),
        Verbose:  ctx.Bool("verbose"),
      });
    }

    startSteamer := func (wg *sync.WaitGroup) {
      defer wg.Done()
      StartStreamer(ServiceStreamerConfig{
        Host:     ctx.String("host"),
        StreamerPort: ctx.Int("streamer-port"),
        DBURL:    ctx.String("db-url"),
        Verbose:  ctx.Bool("verbose"),
      });
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
