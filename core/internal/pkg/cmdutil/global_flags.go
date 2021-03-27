package cmdutil

import (
	cons "core/internal/pkg/constants"

	"github.com/urfave/cli/v2"
)

const (
	// PGConnStrFlag Postgres URL Flag
	PGConnStrFlag = "pg-url"
	// RedisAddr Redis address (host:port)
	RedisAddr = "redis-addr"
	// RedisPassword Redis password
	RedisPassword = "redis-pw"
	// RedisDB Redis DB number
	RedisDB = "redis-db"
	// VerboseFlag Verbose flag (show debug logging)
	VerboseFlag = "verbose"
)

// GlobalFlags global app level flags
var GlobalFlags []cli.Flag = []cli.Flag{
	&cli.StringFlag{
		Name:  PGConnStrFlag,
		Usage: "Postgres Connection URL",
		Value: cons.DefaultPGConnStr,
	},
	&cli.StringFlag{
		Name:  RedisAddr,
		Usage: "Redis address (host:port)",
		Value: cons.DefaultRedisAddr,
	},
	&cli.StringFlag{
		Name:  RedisPassword,
		Usage: "Redis password",
		Value: cons.DefaultRedisPassword,
	},
	&cli.UintFlag{
		Name:  RedisDB,
		Usage: "Redis database (default: 0)",
		Value: uint(cons.DefaultRedisDB),
	},
	&cli.BoolFlag{
		Name:    VerboseFlag,
		Aliases: []string{"v"},
		Usage:   "Enable logging to stdout",
		Value:   cons.DefaultVerbose,
	},
}
