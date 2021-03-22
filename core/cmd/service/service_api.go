package service

import (
	"context"
	"io/ioutil"
	"log"
	"runtime"
	"strconv"

	"core/pkg/db"
	"core/internal/pkg/api"
	"core/internal/pkg/policy"

	"github.com/sirupsen/logrus"
)

// ServiceAPIConfig API service configuration
type ServiceAPIConfig struct {
	Host     string
	HTTPPort int
	DBURL    string
	Verbose  bool
}

// StartAPI start API
func StartAPI(cnf ServiceAPIConfig) {
	if !cnf.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":     cnf.Host,
		"httpPort": cnf.HTTPPort,
		"dbURL":    cnf.DBURL,
		"verbose":  cnf.Verbose,
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

	api.NewServer(cnf.Host, strconv.Itoa(cnf.HTTPPort), cnf.Verbose)
}
