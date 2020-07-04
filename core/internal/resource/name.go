package resource

// Name resource name
type Name string

func (r Name) String() string {
	return string(r)
}
