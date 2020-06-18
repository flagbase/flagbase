package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"core/internal/constants"
	"core/internal/db"
	"core/internal/policy"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

// StartConfig server config
type StartConfig struct {
	Host     string
	HTTPPort int
	DbURL    string
	Verbose  bool
}

// StartCommand start cli command
var StartCommand cli.Command = cli.Command{
	Name:  "start",
	Usage: "Run in server mode",
	Description: "Start flagbased in server mode. This puts it in a state in " +
		"which it is ready serve requests from flagbase clients.",
	ArgsUsage: "[arrgh]",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:  "host",
			Usage: "Server Host Address",
			Value: "localhost",
		},
		&cli.IntFlag{
			Name:  "http-port",
			Value: 5051,
		},
		&cli.StringFlag{
			Name:  "db-url",
			Usage: "Postgres Connection URL",
			Value: constants.DefaultDbURL,
		},
		&cli.BoolFlag{
			Name:    "verbose",
			Aliases: []string{"v"},
			Usage:   "Enable logging to stdout",
			Value:   constants.DefaultVerbose,
		},
	},
	Action: func(ctx *cli.Context) error {
		cnf := StartConfig{
			Host:     ctx.String("host"),
			HTTPPort: ctx.Int("http-port"),
			DbURL:    ctx.String("db-url"),
			Verbose:  ctx.Bool("verbose"),
		}
		Start(cnf)
		return nil
	},
}

// Start run server process
func Start(cnf StartConfig) {
	if cnf.Verbose == false {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":     cnf.Host,
		"httpPort": cnf.HTTPPort,
		"dbURL":    cnf.DbURL,
		"verbose":  cnf.Verbose,
	}).Info("Starting flagbased with the following flags")

	if err := db.NewPool(context.Background(), cnf.DbURL, cnf.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		os.Exit(1)
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cnf.DbURL); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		os.Exit(1)
	}

	ok, err := policy.Enforcer.Enforce("5fe72c43-5ab6-4933-b439-6e740b405be9", "5fe72c43-5ab6-4933-b439-6e740b405be9", "root")
	fmt.Println(ok, err.Error())

	// http.NewHTTPServer(cnf.Host, strconv.Itoa(cnf.HTTPPort), cnf.Verbose)
}
