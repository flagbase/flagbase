package appcontext

import (
	"context"
	"io/ioutil"
	"os"

	"core/internal/pkg/policy"
	"core/pkg/db"

	"github.com/rs/zerolog"
)

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
