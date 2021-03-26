package cache

import (
	"github.com/go-redis/redis/v8"
)

// Config redis connection configuration
type Config redis.Options

// New init a new redis client
func New(cnf Config) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     cnf.Addr,
		Password: cnf.Password,
		DB:       cnf.DB,
	})
	return rdb
}
