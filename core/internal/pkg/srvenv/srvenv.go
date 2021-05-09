package srvenv

import (
	"core/internal/pkg/policy"
	"core/pkg/logger"

	"github.com/go-redis/redis"
	"github.com/jackc/pgx/v4/pgxpool"
)

// Env primary app context structure
type Env struct {
	Cache             *redis.Client
	DB                *pgxpool.Pool
	Log               *logger.Logger
	Policy            *policy.Policy
	Metric            string // TODO: add metric interface
	SecureRuntimeHash string
}
