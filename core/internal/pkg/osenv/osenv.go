package osenv

import (
	"os"
)

const (
	// PGConnStrEnv Postgres URL environment variable
	PGConnStrEnv = "FLAGBASE_CORE_PG_URL"
	// RedisAddr Redis address (host:port) environment variable
	RedisAddrEnv = "FLAGBASE_CORE_REDIR_ADDR"
	// RedisPassword Redis password environment variable
	//nolint:gosec
	RedisPasswordEnv = "FLAGBASE_CORE_REDIS_PASSWORD"
	// RedisDB Redis DB number environment variable
	RedisDBEnv = "FLAGBASE_CORE_REDIS_DB"
)

func GetEnvOrDefault(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
