package main

import (
	"context"
	"core/internal/constants"
	"core/internal/db"
	"core/internal/policy"
	"core/internal/resource"
	"core/pkg/access"
	"errors"
	"os"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

// CreateRootConfig server config
type CreateRootConfig struct {
	DbURL      string
	Verbose    bool
	RootKey    resource.Key
	RootSecret string
}

// CreateRootCommand init cli command
var CreateRootCommand cli.Command = cli.Command{
	Name:        "create-root",
	Usage:       "Create root access",
	Description: "Create root access key-secret pair",
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
		cnf := CreateRootConfig{
			DbURL:      ctx.String("db-url"),
			RootKey:    resource.Key(ctx.String("root-key")),
			RootSecret: ctx.String("root-secret"),
			Verbose:    ctx.Bool("verbose"),
		}
		CreateRoot(cnf)
		return nil
	},
}

// CreateRoot create root access
func CreateRoot(cnf CreateRootConfig) {
	if err := db.NewPool(context.Background(), cnf.DbURL, cnf.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		os.Exit(1)
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cnf.DbURL); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		os.Exit(1)
	}

	if err := createRootAccess(cnf.RootKey, cnf.RootSecret); err != nil {
		logrus.Error("Unable to create root access. Perhap the access-key already exists.")
		os.Exit(1)
	} else {
		logrus.WithFields(logrus.Fields{
			"key":    cnf.RootKey,
			"secret": cnf.RootSecret,
		}).Info("Created root access")
	}
}

func createRootAccess(rootKey resource.Key, rootSecret string) error {
	_, err := access.CreateAccess(access.Access{
		Key:         rootKey,
		Secret:      rootSecret,
		Name:        "Flagbase Root",
		Description: "Default root access",
		Type:        resource.RootAccess,
		Tags:        []string{},
		ExpiresAt:   constants.MaxUnixTime,
	})
	if err.Errors != nil {
		return errors.New("unable to create root access - perhaps thisuser already exists")
	}

	return nil
}
