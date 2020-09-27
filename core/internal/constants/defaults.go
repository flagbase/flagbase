package constants

import (
	"time"
)

var (
	// DefaultDbURL the default postgres database connection string
	DefaultDbURL string = "postgres://flagbase:BjrvWmjQ3dykPu@" +
		"db:5432/flagbase" +
		"?sslmode=disable"
	// DefaultVerbose should log verbosely by default
	DefaultVerbose bool = false
	// DefaultRootKey default root access key
	DefaultRootKey string = "root"
	// DefaultRootSecret default root access secret
	DefaultRootSecret string = "toor"
	// MaxUnixTime The maxiumum unix time
	// TODO: come up with better method in year 2038
	MaxUnixTime int64 = 9223372036854775807
	// JWTKey used to encode jwt
	JWTKey string = "bad_secret"
	// JWTExpiry default jwt expiry time
	JWTExpiry int64 = time.Now().Add(50000 * time.Minute).Unix()
	// DefaultPrometheus for if prometheus is setup
	DefaultPrometheus bool = false
)
