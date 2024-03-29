package db

import (
	"context"

	"github.com/jackc/pgx/v4/log/zerologadapter"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/rs/zerolog"
)

// Config db connection configuration
type Config struct {
	Ctx     context.Context
	Verbose bool
	Log     *zerolog.Logger
	ConnStr string
}

// New establishes a new pqx connection pool
func New(cfg Config) (*pgxpool.Pool, error) {
	poolConfig, err := pgxpool.ParseConfig(cfg.ConnStr)
	if err != nil {
		return nil, err
	}

	if cfg.Verbose {
		poolConfig.ConnConfig.Logger = zerologadapter.NewLogger(*cfg.Log)
	}

	return pgxpool.ConnectConfig(cfg.Ctx, poolConfig)
}
