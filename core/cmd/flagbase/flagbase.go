package main

import (
	"core/cmd/manage"
	"core/cmd/service"

	"github.com/urfave/cli/v2"
)

// AppCommand root app entry cmd
var AppCommand *cli.App = &cli.App{
	Name:                 "flagbase",
	Usage:                "Feature Management Service",
	Description:          "Flagbase is a general-purpose feature management service.",
	EnableBashCompletion: true,
	Commands: []*cli.Command{
		&service.ServiceCommand,
		&manage.ManageCommand,
	},
}
