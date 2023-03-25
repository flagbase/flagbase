package resource

// AccessScope resource access type (root, admin, user, service)
type AccessScope int

const (
	// AccessScopeInstance has access to the instance scope
	AccessScopeInstance AccessScope = iota
	// AccessScopeWorkspace has access to the workspace scope
	AccessScopeWorkspace
	// AccessScopeProject has access to the project scope
	AccessScopeProject
)

// AccessScopeToString convert access type to string
var AccessScopeToString = map[AccessScope]string{
	AccessScopeInstance:  "instance",
	AccessScopeWorkspace: "workspace",
	AccessScopeProject:   "project",
}

// AccessScopeFromString convert from string access type
var AccessScopeFromString = map[string]AccessScope{
	"instance":  AccessScopeInstance,
	"workspace": AccessScopeWorkspace,
	"project":   AccessScopeProject,
}

func (r AccessScope) String() string {
	if s, ok := AccessScopeToString[r]; ok {
		return s
	}
	return "unknown_access_type"
}
