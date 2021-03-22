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
	Host    string
	APIPort int
	DBURL   string
	Verbose bool
}

// StartAPI start API
func StartAPI(cnf APIConfig) {
	if !cnf.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":    cnf.Host,
		"apiPort": cnf.APIPort,
		"dbURL":   cnf.DBURL,
		"verbose": cnf.Verbose,
	}).Info("Starting API")

	if err := db.NewPool(context.Background(), cnf.DBURL, cnf.Verbose); err != nil {
		logrus.Error("Unable to connect to db - ", err.Error())
		runtime.Goexit()
	}
	defer db.Pool.Close()

	if err := policy.NewEnforcer(cnf.DBURL); err != nil {
		logrus.Error("Unable to start enforcer - ", err.Error())
		runtime.Goexit()
	}

	api.NewServer(cnf.Host, strconv.Itoa(cnf.APIPort), cnf.Verbose)
}
