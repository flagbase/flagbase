package resource

// Key resource key unique to namespace
type Key string

func (r Key) String() string {
	return string(r)
}
