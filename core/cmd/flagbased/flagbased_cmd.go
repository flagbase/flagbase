package main

import (
	"core/cmd/manage"
	"core/cmd/worker"

	"github.com/urfave/cli/v2"
)

// AppCommand root app entry cmd
var AppCommand *cli.App = &cli.App{
	Name:                 "flagbased",
	Usage:                "Flagbase Core Daemon",
	Description:          "Primary daemon process for Flagbase Core",
	EnableBashCompletion: true,
	Commands: []*cli.Command{
		&worker.Command,
		&manage.Command,
	},
}
