package manage

import (
	"github.com/urfave/cli/v2"
)

// Command manage command entry
var Command cli.Command = cli.Command{
	Name:        "manage",
	Usage:       "Manage resources",
	Description: "Manage flagbase resources.",
	Subcommands: []*cli.Command{
		&ManageAccessCommand,
		&ManageMigrateCommand,
	},
}
