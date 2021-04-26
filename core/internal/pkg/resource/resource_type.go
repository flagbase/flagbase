package resource

// Type specifies the type of resource object
type Type string

func (r Type) String() string {
	return string(r)
}

const (
	// Workspace represents a workspace resource
	Workspace Type = "workspace"
	// Project represents a project resource
	Project Type = "project"
	// Environment represents a environment resource
	Environment Type = "environment"
	// Access represents a environment resource
	Access Type = "access"
	// Flag represents a flag resource
	Flag Type = "flag"
	// Variation represents a variation resource
	Variation Type = "variation"
	// Segment represents a segment resource
	Segment Type = "segment"
	// SegmentRule represents a segment rule resource
	SegmentRule Type = "segment_rule"
	// Identity represents a identity resource
	Identity Type = "identity"
	// Trait represents a certain characteristic of an identity
	Trait Type = "trait"
	// Targeting represents a targeting resource
	Targeting Type = "targeting"
	// FallthroughVariation represents a weighted fallthough variation
	FallthroughVariation Type = "targeting_fallthrough_variation"
	// TargetingRule represents a targeting rule resource
	TargetingRule Type = "targeting_rule"
	// RuleVariation represents a targeting rule variation
	RuleVariation Type = "targeting_rule_variation"
)
