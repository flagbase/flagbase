package resource

// ID unique resource id
type ID string

func (r ID) String() string {
	return string(r)
}
