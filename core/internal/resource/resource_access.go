package resource

// AccessType resource access type (root, admin, user, service)
type AccessType int

const (
	// ServiceAccess has read access to a resource and its children
	ServiceAccess AccessType = iota
	// UserAccess has write access to a resource and its children
	// They can create ServiceAccess to resources
	UserAccess
	// AdminAccess has access to all resources under a single workspace.
	// They can create UserAccess & ServiceAccess on resources
	AdminAccess
	// RootAccess has access to all resources.
	// They can create AdminAccess, UserAccess & ServiceAccess on resources.
	RootAccess
)

// AccessTypeToString convert access type to string
var AccessTypeToString = map[AccessType]string{
	ServiceAccess: "service",
	UserAccess:    "user",
	AdminAccess:   "admin",
	RootAccess:    "root",
}

// AccessTypeFromString convert from string access type
var AccessTypeFromString = map[string]AccessType{
	"service": ServiceAccess,
	"user":    UserAccess,
	"admin":   AdminAccess,
	"root":    RootAccess,
}

func (r AccessType) String() string {
	if s, ok := AccessTypeToString[r]; ok {
		return s
	}
	return "unknown_access_type"
}
