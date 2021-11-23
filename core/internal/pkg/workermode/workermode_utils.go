package workermode

import (
	"fmt"
	"strings"
)

// StrListModes List of all worker modes
func StrListModes() string {
	return fmt.Sprintf(
		"%s, %s, %s, %s or %s",
		string(AllMode),
		string(APIMode),
		string(GraphQLMode),
		string(StreamerMode),
		string(PollerMode),
	)
}

// StrStartingWorker Starting worker mode string
func StrStartingWorker(mode Mode) string {
	return fmt.Sprintf("Starting %s worker", strings.ToUpper(string(mode)))
}
