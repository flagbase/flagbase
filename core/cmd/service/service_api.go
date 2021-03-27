package service

import (
	"context"
	"io/ioutil"
	"log"
	"runtime"

	"core/internal/pkg/api"
	"core/internal/pkg/policy"
	srv "core/internal/pkg/server"
	"core/pkg/db"

	"github.com/sirupsen/logrus"
)

// APIConfig API service configuration
type APIConfig struct {
	Host          string
	APIPort       int
	Verbose       bool
	PGConnStr     string
	RedisAddr     string
	RedisPassword string
	RedisDB       int
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

	sctx, err := srv.Setup(srv.Config{
		Ctx:           context.Background(),
		PGConnStr:     cfg.PGConnStr,
		RedisAddr:     cfg.RedisAddr,
		RedisPassword: cfg.RedisPassword,
		RedisDB:       cfg.RedisDB,
		Verbose:       cfg.Verbose,
	})
	if err != nil {
		logrus.Error("Unable to setup app context. Reason: ", err.Error())
		runtime.Goexit()
	}
	defer srv.Cleanup(sctx)

	api.New(sctx, api.Config{
		Host:    cfg.Host,
		APIPort: cfg.APIPort,
		Verbose: cfg.Verbose,
	})
}
