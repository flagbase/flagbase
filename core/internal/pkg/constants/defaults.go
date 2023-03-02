package constants

import (
	"time"
)

var (
	// DefaultPGConnStr the default postgres database connection string
	DefaultPGConnStr = "postgres://flagbase:BjrvWmjQ3dykPu@" +
		"db:5432/flagbase" +
		"?sslmode=disable"
	// DefaultRedisAddr default redis address
	DefaultRedisAddr = "redis:6379"
	// DefaultRedisPassword default redis password
	DefaultRedisPassword = ""
	// DefaultRedisDB default redis database number
	DefaultRedisDB = 0
	// DefaultAPIPort default HTTP API server port
	DefaultAPIPort = 5051
	// DefaultStreamerPort default streamer server port
	DefaultStreamerPort = 7051
	// DefaultPollingPort default polling server port
	DefaultPollingPort = 9051
	// DefaultVerbose should log verbosely by default
	DefaultVerbose = false
	// DefaultRootKey default root access key
	DefaultRootKey = "root"
	// DefaultRootSecret default root access secret
	DefaultRootSecret = "toor"
	// MaxUnixTime The maxiumum unix time
	// TODO: come up with better method in year 2038
	MaxUnixTime = 9223372036854775807
	// JWTKey used to encode jwt
	JWTKey = "bad_secret"
	// JWTExpiryMinutes default JWT lifetime (in minutes)
	JWTExpiryMinutes time.Duration = 5000
	// DefaultCacheExpiry default Cache lifetime (in seconds)
	DefaultCacheExpiry time.Duration = 300000000000
	// DefaultPrometheus for if prometheus is setup
	DefaultPrometheus bool = false
)
