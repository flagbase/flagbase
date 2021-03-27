package server

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
func Setup(cfg Config) (*Ctx, error) {
	// setup: logger
	logInst := logger.New(logger.Config{
		Verbose: cfg.Verbose,
	})

	// setup DB
	dbInst, err := db.New(db.Config{
		Ctx:     cfg.Ctx,
		ConnStr: cfg.PGConnStr,
		Verbose: cfg.Verbose,
		Log:     logInst.Logger,
	})
	if err != nil {
		return nil, err
	}

	// setup policy
	policyInst, err := policy.Setup(
		policy.Config{PGConnStr: cfg.PGConnStr},
	)
	if err != nil {
		return nil, err
	}

	// setup cache
	cacheInst := cache.New(cache.Config{
		Addr:     cfg.RedisAddr,
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
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
