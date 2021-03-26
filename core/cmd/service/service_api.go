package service

import (
	"context"
	"io/ioutil"
	"log"
	"runtime"
	"strconv"

	"core/internal/pkg/api"
	"core/internal/pkg/policy"
	"core/pkg/db"

	"github.com/sirupsen/logrus"
)

// APIConfig API service configuration
type APIConfig struct {
	Host      string
	APIPort   int
	PGConnStr string
	Verbose   bool
}

// StartAPI start API
func StartAPI(cfg APIConfig) {
	if !cfg.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":    cfg.Host,
		"apiPort": cfg.APIPort,
		"dbURL":   cfg.PGConnStr,
		"verbose": cfg.Verbose,
	}).Info("Starting API")

	if err := db.NewPool(context.Background(), cfg.PGConnStr, cfg.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		runtime.Goexit()
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cfg.PGConnStr); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		runtime.Goexit()
	}

	api.NewServer(cfg.Host, strconv.Itoa(cfg.APIPort), cfg.Verbose)
}
