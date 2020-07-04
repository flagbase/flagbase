package resource

// AccessType resource access type (root, admin, user, service)
type AccessType string

func (r AccessType) String() string {
	return string(r)
}

const (
	// RootAccess has access to all resources.
	// They can create AdminAccess, UserAccess & ServiceAccess on resources.
	RootAccess = "root"
	// AdminAccess has access to all resources under a single workspace.
	// They can create UserAccess & ServiceAccess on resources
	AdminAccess = "admin"
	// UserAccess has write access to a resource and its children
	// They can create ServiceAccess to resources
	UserAccess = "user"
	// ServiceAccess has read access to a resource and its children
	ServiceAccess = "service"
)
