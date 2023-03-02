package cmdutil

import (
	cons "core/internal/pkg/constants"
	"core/internal/pkg/osenv"
	"strconv"

	"github.com/urfave/cli/v2"
)

const (
	// PGConnStrFlag Postgres URL Flag
	PGConnStrFlag = "pg-url"
	// RedisAddr Redis address (host:port)
	RedisAddrFlag = "redis-addr"
	// RedisPassword Redis password
	RedisPasswordFlag = "redis-pw"
	// RedisDB Redis DB number
	RedisDBFlag = "redis-db"
	// VerboseFlag Verbose flag (show debug logging)
	VerboseFlag = "verbose"
)

// GlobalFlags global app level flags
var GlobalFlags []cli.Flag = []cli.Flag{
	&cli.StringFlag{
		Name:  PGConnStrFlag,
		Usage: "Postgres Connection URL",
		Value: osenv.GetEnvOrDefault(osenv.PGConnStrEnv, cons.DefaultPGConnStr),
	},
	&cli.StringFlag{
		Name:  RedisAddrFlag,
		Usage: "Redis address (host:port)",
		Value: osenv.GetEnvOrDefault(osenv.RedisAddrEnv, cons.DefaultRedisAddr),
	},
	&cli.StringFlag{
		Name:  RedisPasswordFlag,
		Usage: "Redis password",
		Value: osenv.GetEnvOrDefault(osenv.RedisPasswordEnv, cons.DefaultRedisPassword),
	},
	&cli.UintFlag{
		Name:  RedisDBFlag,
		Usage: "Redis database (default: 0)",
		Value: func() uint {
			val, err := strconv.ParseUint(
				osenv.GetEnvOrDefault(
					osenv.RedisDBEnv,
					strconv.FormatUint(uint64(cons.DefaultRedisDB), 10),
				),
				10,
				0,
			)
			if err != nil {
				panic(err)
			}
			return uint(val)
		}(),
	},
	&cli.BoolFlag{
		Name:    VerboseFlag,
		Aliases: []string{"v"},
		Usage:   "Enable logging to stdout",
		Value:   cons.DefaultVerbose,
	},
}
