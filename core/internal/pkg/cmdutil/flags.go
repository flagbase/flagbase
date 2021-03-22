package cmdutil

import (
	cons "core/internal/pkg/constants"

	"github.com/urfave/cli/v2"
)

const (
	// DBURLFlag Postgres URL Flag
	DBURLFlag = "db-url"
	// VerboseFlag Verbose flag (show debug logging)
	VerboseFlag = "verbose"
)

// GlobalFlags global app level flags
var GlobalFlags []cli.Flag = []cli.Flag{
	&cli.StringFlag{
		Name:  DBURLFlag,
		Usage: "Postgres Connection URL",
		Value: cons.DefaultDBURL,
	},
	&cli.BoolFlag{
		Name:    VerboseFlag,
		Aliases: []string{"v"},
		Usage:   "Enable logging to stdout",
		Value:   cons.DefaultVerbose,
	},
}
