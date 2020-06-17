package main

import (
	"context"
	"core/generated/models"
	"core/internal/constants"
	"core/internal/db"
	"core/internal/enforce"
	"core/pkg/access"
	"errors"
	"os"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

// InitConfig server config
type InitConfig struct {
	DbURL      string
	Verbose    bool
	RootKey    string
	RootSecret string
}

// InitCommand init cli command
var InitCommand cli.Command = cli.Command{
	Name:        "init",
	Usage:       "Initialise server",
	Description: "Initialise server database, root user etc. This should be run only once.",
	ArgsUsage:   "[arrgh]",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  "db-url",
			Usage: "Postgres Connection URL",
			Value: constants.DefaultDbURL,
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
		cnf := InitConfig{
			DbURL:      ctx.String("db-url"),
			RootKey:    ctx.String("root-key"),
			RootSecret: ctx.String("root-secret"),
			Verbose:    ctx.Bool("verbose"),
		}
		Init(cnf)
		return nil
	},
}

// Init initialisation process
func Init(cnf InitConfig) {
	if err := db.NewPool(context.Background(), cnf.DbURL, cnf.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		os.Exit(1)
	}
	defer db.Pool.Close()

	if err := enforce.NewEnforcer(cnf.DbURL); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		os.Exit(1)
	}

	if err := createRootAccess(cnf.RootKey, cnf.RootSecret); err != nil {
		logrus.Error("Unable to create root user")
		os.Exit(1)
	} else {
		logrus.WithFields(logrus.Fields{
			"key":    cnf.RootKey,
			"secret": cnf.RootSecret,
		}).Info("Created root user")
	}
}

func createRootAccess(rootKey string, rootSecret string) error {
	a := models.Access{
		Key:         rootKey,
		Secret:      rootSecret,
		Name:        "Flagbase Root",
		Description: "Default root user",
		Type:        "root",
		Tags:        []string{},
		ExpiresAt:   constants.MaxUnixTime,
	}

	_, err := access.CreateAccess(a)
	if err.Errors != nil {
		return errors.New("unable to create root access")
	}

	return nil
}
