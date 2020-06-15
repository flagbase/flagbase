package db

import (
	"context"

	"github.com/jackc/pgx/v4/log/logrusadapter"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/sirupsen/logrus"
)

var (
	// Pool postgresql connection pool
	Pool *pgxpool.Pool
)

// NewPool establishes a new pqx connection pool
func NewPool(ctx context.Context, connStr string, debug bool) error {
	poolConfig, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return err
	}

	if debug == true {
		poolConfig.ConnConfig.Logger = logrusadapter.NewLogger(logrus.New())
	}

	Pool, err = pgxpool.ConnectConfig(ctx, poolConfig)
	if err != nil {
		return err
	}

	return nil
}
