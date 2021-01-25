package resource

// Key resource key unique to namespace
type Key string

func (r Key) String() string {
	return string(r)
}

const (
	// WorkspaceKey represents a workspace key
	WorkspaceKey Key = "workspaceKey"
	// ProjectKey represents a project key
	ProjectKey Key = "projectKey"
	// EnvironmentKey represents a environment key
	EnvironmentKey Key = "environmentKey"
	// FlagKey represents a flag key
	FlagKey Key = "flagKey"
	// VariationKey represents a variation key
	VariationKey Key = "variationKey"
	// SegmentKey represents a segment key
	SegmentKey Key = "segmentKey"
	// RuleKey represents a rule key
	RuleKey Key = "ruleKey"
	// IdentityKey represents a identity key
	IdentityKey Key = "identityKey"
	// TraitKey represents a trait key
	TraitKey Key = "traitKey"
	// AccessKey represents a access key
	AccessKey Key = "accessKey"
)
