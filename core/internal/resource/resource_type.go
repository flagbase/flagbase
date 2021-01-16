package resource

// Type specifies the type of resource object
type Type string

func (r Type) String() string {
	return string(r)
}

const (
	// Workspace represents a workspace resource
	Workspace = "workspace"
	// Project represents a project resource
	Project = "project"
	// Environment represents a environment resource
	Environment = "environment"
	// Access represents a environment resource
	Access = "access"
	// Flag represents a flag resource
	Flag = "flag"
	// Variation represents a variation resource
	Variation = "variation"
	// Segment represents a segment resource
	Segment = "segment"
	// Identity represents a identity resource
	Identity = "identity"
	// Trait represents a certain characteristic of an identity
	Trait = "trait"
	// Targeting represents a targeting resource
	Targeting = "targeting"
)
