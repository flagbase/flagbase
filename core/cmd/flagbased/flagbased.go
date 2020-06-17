package main

import (
	"os"

	"github.com/urfave/cli/v2"
)

// Exec flagbased with args
func main() {
	app := &cli.App{
		Name:                 "flagbased",
		Usage:                "Feature flag server",
		Description:          "flagbased is a general-purpose feature flag server.",
		EnableBashCompletion: true,
		Commands: []*cli.Command{
			&StartCommand,
			&InitCommand,
		},
	}

	app.Run(os.Args)
}
