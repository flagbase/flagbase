package main

import (
	"context"
	"io/ioutil"
	"log"
	"runtime"
	"strconv"

	"core/internal/constants"
	"core/internal/db"
	"core/internal/http"
	"core/internal/policy"

	"github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
)

// StartConfig server config
type StartConfig struct {
	Host     string
	HTTPPort int
	DBURL    string
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
			Value: "0.0.0.0",
		},
		&cli.IntFlag{
			Name:  "http-port",
			Value: constants.DefaultHTTPPort,
		},
		&cli.StringFlag{
			Name:  "db-url",
			Usage: "Postgres Connection URL",
			Value: constants.DefaultDBURL,
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
			DBURL:    ctx.String("db-url"),
			Verbose:  ctx.Bool("verbose"),
		}
		Start(cnf)
		return nil
	},
}

// Start run server process
func Start(cnf StartConfig) {
	if !cnf.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":     cnf.Host,
		"httpPort": cnf.HTTPPort,
		"dbURL":    cnf.DBURL,
		"verbose":  cnf.Verbose,
	}).Info("Starting flagbased with the following flags")

	if err := db.NewPool(context.Background(), cnf.DBURL, cnf.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		runtime.Goexit()
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cnf.DBURL); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		runtime.Goexit()
	}

	http.NewHTTPServer(cnf.Host, strconv.Itoa(cnf.HTTPPort), cnf.Verbose)
}
