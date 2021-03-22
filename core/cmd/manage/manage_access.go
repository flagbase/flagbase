package manage

import (
	"context"
	"core/internal/pkg/constants"
	"core/pkg/db"
	"core/internal/pkg/policy"
	rsc "core/internal/pkg/resource"
	"core/internal/core/access"
	"errors"
	"runtime"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

// ManageAccessConfig server config
type ManageAccessConfig struct {
	DBURL      string
	Verbose    bool
	RootKey    rsc.Key
	RootSecret string
}

// ManageAccessCommand init cli command
var ManageAccessCommand cli.Command = cli.Command{
	Name:        "create-root",
	Usage:       "Create root access",
	Description: "Create root access key-secret pair",
	ArgsUsage:   "[arrgh]",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  "db-url",
			Usage: "Postgres Connection URL",
			Value: constants.DefaultDBURL,
		},
		&cli.StringFlag{
			Name:  "root-key",
			Usage: "Default root access key",
			Value: constants.DefaultRootKey,
		},
		&cli.StringFlag{
			Name:  "root-secret",
			Usage: "Default root access secret",
			Value: constants.DefaultRootSecret,
		},
		&cli.BoolFlag{
			Name:    "verbose",
			Aliases: []string{"v"},
			Usage:   "Enable logging to stdout",
			Value:   constants.DefaultVerbose,
		},
	},
	Action: func(ctx *cli.Context) error {
		cnf := ManageAccessConfig{
			DBURL:      ctx.String("db-url"),
			RootKey:    rsc.Key(ctx.String("root-key")),
			RootSecret: ctx.String("root-secret"),
			Verbose:    ctx.Bool("verbose"),
		}
		CreateRoot(cnf)
		return nil
	},
}

// CreateRoot create root access
func CreateRoot(cnf ManageAccessConfig) {
	if err := db.NewPool(context.Background(), cnf.DBURL, cnf.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		runtime.Goexit()
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cnf.DBURL); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		runtime.Goexit()
	}

	if err := createRootAccess(cnf.RootKey, cnf.RootSecret); err != nil {
		logrus.Error("Unable to create root access. Perhap the access-key already exists.")
		runtime.Goexit()
	} else {
		logrus.WithFields(logrus.Fields{
			"key":    cnf.RootKey,
			"secret": cnf.RootSecret,
		}).Info("Created root access")
	}
}

func createRootAccess(rootKey rsc.Key, rootSecret string) error {
	_, err := access.Create(access.Access{
		Key:         rootKey,
		Secret:      rootSecret,
		Name:        "Flagbase Root",
		Description: "Default root access",
		Type:        rsc.AccessRoot.String(),
		Tags:        []string{},
		ExpiresAt:   constants.MaxUnixTime,
	})
	if err.Errors != nil {
		return errors.New("unable to create root access - perhaps thisuser already exists")
	}

	return nil
}
