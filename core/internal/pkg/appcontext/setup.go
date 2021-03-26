package appcontext

import (
	"context"
	"errors"

	"core/internal/pkg/policy"
	"core/pkg/cache"
	"core/pkg/db"
	"core/pkg/logger"
)

// Config app context configuration
type Config struct {
	Ctx           context.Context
	PGConnStr     string
	RedisAddr     string
	RedisPassword string
	RedisDB       int
	Verbose       bool
}

// Setup init services that make up app-context
func Setup(cnf Config) (*Ctx, error) {
	// setup: logger
	logInst := logger.New(logger.Config{
		Verbose: cnf.Verbose,
	})

	// setup DB
	dbInst, err := db.New(db.Config{
		Ctx:     cnf.Ctx,
		ConnStr: cnf.PGConnStr,
		Verbose: cnf.Verbose,
		Log:     logInst.Logger,
	})
	if err != nil {
		return nil, err
	}

	// setup policy
	policyInst, err := policy.Setup(
		policy.Config{PGConnStr: cnf.PGConnStr},
	)
	if err != nil {
		return nil, err
	}

	// setup cache
	cacheInst := cache.New(cache.Config{
		Addr:     cnf.RedisAddr,
		Password: cnf.RedisPassword,
		DB:       cnf.RedisDB,
	})
	if cacheInst == nil {
		return nil, errors.New("unable to connect to redis")
	}

	return &Ctx{
		Cache:  cacheInst,
		DB:     dbInst,
		Log:    logInst,
		Policy: policyInst,
	}, nil
}
