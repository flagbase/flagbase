package cache

import (
	"github.com/go-redis/redis/v8"
)

// Config redis connection configuration
type Config redis.Options

// New init a new redis client
func New(cfg Config) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cfg.Addr,
		Password: cfg.Password,
		DB:       cfg.DB,
	})
	return rdb
}
