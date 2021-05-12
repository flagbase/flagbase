package server

import (
	"context"
	"errors"

	"core/internal/pkg/policy"
	"core/internal/pkg/srvenv"
	"core/pkg/cache"
	"core/pkg/db"
	"core/pkg/logger"

	"github.com/google/uuid"
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
func Setup(cfg Config) (*srvenv.Env, error) {
	// setup: secure runtime hash
	secureRuntimeHash := uuid.New().String()

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

	return &srvenv.Env{
		Cache:             cacheInst,
		DB:                dbInst,
		Log:               logInst,
		Policy:            policyInst,
		SecureRuntimeHash: secureRuntimeHash,
	}, nil
}
