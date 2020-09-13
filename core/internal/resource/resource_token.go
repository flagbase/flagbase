package resource

// Token access token
type Token string

func (c Token) String() string {
	return string(c)
}
