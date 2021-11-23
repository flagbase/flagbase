package worker

const (
	// ModeFlag Type of worker (api, graphql, streamer, poller)
	ModeFlag string = "mode"
	// HostFlag Server host address
	HostFlag string = "host"
	// APIPortFlag Port API will operate within
	APIPortFlag string = "api-port"
	// StreamerPortFlag Port streamer will operate within
	StreamerPortFlag string = "streamer-port"
	// PollingPortFlag Port streamer will operate within
	PollerPortFlag string = "poller-port"
)
