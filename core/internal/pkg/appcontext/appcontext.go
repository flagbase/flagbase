package appcontext

import (
	"context"
	"io/ioutil"
	"os"

	"core/internal/pkg/policy"
	"core/pkg/db"

	"github.com/go-redis/redis/v8"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/rs/zerolog"
)

// Ctx primary app context structure
type Ctx struct {
	Cache  *redis.Client
	DB     *pgxpool.Pool
	Log    *zerolog.Logger
	Policy *policy.Policy
	Metric string // TODO: add metric interface
}

// Config app context configuration
type Config struct {
	Ctx       context.Context
	PGConnStr string
	Verbose   bool
}

// Setup init services that make up app-context
func Setup(cnf Config) (*Ctx, error) {
	// setup: logger
	var logger zerolog.Logger
	if cnf.Verbose {
		logger = zerolog.New(
			zerolog.ConsoleWriter{Out: os.Stderr},
		)
	} else {
		logger = zerolog.New(ioutil.Discard)
	}

	// setup DB
	dbConn, err := db.New(db.Config{
		Ctx:     cnf.Ctx,
		ConnStr: cnf.PGConnStr,
		Verbose: cnf.Verbose,
		Log:     &logger,
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

	return &Ctx{
		DB:     dbConn,
		Log:    &logger,
		Policy: policyInst,
	}, nil
}
