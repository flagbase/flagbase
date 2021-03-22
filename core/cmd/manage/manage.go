package manage

import (
	"github.com/urfave/cli/v2"
)

// ManageCommand manage command entry
var ManageCommand cli.Command = cli.Command{
	Name:        "manage",
	Usage:       "Manage resources",
	Description: "Manage flagbase resources.",
	Subcommands: []*cli.Command{
		&ManageAccessCommand,
	},
}
