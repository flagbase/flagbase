package workermode

// Mode represents the key for the worker mode
type Mode string

func (r Mode) String() string {
	return string(r)
}

const (
	// AllMode represents the defalt worker mode (i.e. all workers)
	AllMode Mode = "all"
	// APIMode represents the API worker mode
	APIMode Mode = "api"
	// StreamerMode represents the Streamer worker mode
	StreamerMode Mode = "streamer"
	// PollerMode represents the Poller worker mode
	PollerMode Mode = "poller"
	// GraphQLMode represents the GraphQL worker mode
	GraphQLMode Mode = "graphql"
)
