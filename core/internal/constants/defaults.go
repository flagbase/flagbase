package constants

import (
	"core/internal/rand"
)

var (
	// DefaultDbURL the default postgres database connection string
	DefaultDbURL string = "postgres://flagbase:BjrvWmjQ3dykPu@" +
		"127.0.0.1:5432/flagbase" +
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
	// RuntimeToken is a randomly generated token
	// used for generating root user
	RuntimeToken string = rand.String(64)
)
