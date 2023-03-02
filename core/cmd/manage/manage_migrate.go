package manage

import (
	"core/internal/infra/migrate"
	"core/internal/pkg/cmdutil"
	"log"

	"github.com/urfave/cli/v2"
)

// MigrateConfig server config
type MigrateConfig struct {
	PGConnStr string
	Verbose   bool
}

// ManageMigrateCommand manage access command entry
var ManageMigrateCommand cli.Command = cli.Command{
	Name:        "migrate",
	Usage:       "Run db migrations",
	Description: "Run db migrations",
	Subcommands: []*cli.Command{
		&ManageMigrateUpCommand,
		&ManageMigrateDownCommand,
	},
}

// ManageMigrateUpCommand run upward migrations command entry
var ManageMigrateUpCommand cli.Command = cli.Command{
	Name:        "up",
	Description: "Migrate upwards",
	Usage:       "Apply migrations in upward direction",
	Flags:       cmdutil.GlobalFlags,
	Action: func(ctx *cli.Context) error {
		if err := migrate.Migrate(ctx.String(cmdutil.PGConnStrFlag), true); err != nil {
			log.Fatal("Unable to run migrations. Reason: ", err.Error())
		}
		return nil
	},
}

// ManageMigrateDownCommand run upward migrations command entry
var ManageMigrateDownCommand cli.Command = cli.Command{
	Name:        "down",
	Description: "Migrate downwards",
	Usage:       "Apply migrations in downward direction",
	Flags:       cmdutil.GlobalFlags,
	Action: func(ctx *cli.Context) error {
		if err := migrate.Migrate(ctx.String(cmdutil.PGConnStrFlag), false); err != nil {
			log.Fatal("Unable to run migrations. Reason: ", err.Error())
		}
		return nil
	},
}
