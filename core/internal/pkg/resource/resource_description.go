package resource

// Description resource description
type Description string

func (r Description) String() string {
	return string(r)
}
