package resource

// AccessType resource access type (root, admin, user, service)
type AccessType int

const (
	// AccessService has read access to a resource and its children
	AccessService AccessType = iota
	// AccessUser has write access to a resource and its children
	// They can create AccessService to resources
	AccessUser
	// AccessAdmin has access to all resources under a single workspace.
	// They can create AccessUser & AccessService on resources
	AccessAdmin
	// AccessRoot has access to all resources.
	// They can create AccessAdmin, AccessUser & AccessService on resources.
	AccessRoot
)

// AccessTypeToString convert access type to string
var AccessTypeToString = map[AccessType]string{
	AccessService: "service",
	AccessUser:    "user",
	AccessAdmin:   "admin",
	AccessRoot:    "root",
}

// AccessTypeFromString convert from string access type
var AccessTypeFromString = map[string]AccessType{
	"service": AccessService,
	"user":    AccessUser,
	"admin":   AccessAdmin,
	"root":    AccessRoot,
}

func (r AccessType) String() string {
	if s, ok := AccessTypeToString[r]; ok {
		return s
	}
	return "unknown_access_type"
}
