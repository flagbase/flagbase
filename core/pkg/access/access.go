package access

// Access is used to represent the relationship between the API user and the service. Access objects are attached to the resources, which are used to authorise users.
type Access struct {
	ID          string   `json:"id,omitempty"`
	Key         string   `json:"key,omitempty"`
	Description string   `json:"description,omitempty"`
	ExpiresAt   int64    `json:"expiresAt,omitempty"`
	Name        string   `json:"name,omitempty"`
	Secret      string   `json:"secret,omitempty"`
	Tags        []string `json:"tags,omitempty"`
	Type        string   `json:"type,omitempty"`
}

// KeySecretPair access secret-key pair, used for login
type KeySecretPair struct {
	Key    string `json:"key,omitempty"`
	Secret string `json:"secret,omitempty"`
}

// Token access token
type Token struct {
	Token   string `json:"token,omitempty"`
	*Access `json:"access,omitempty"`
}
