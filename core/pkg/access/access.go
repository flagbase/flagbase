package access

import rsc "core/internal/resource"

// Access is used to represent the relationship between the API user and the service.
// Access objects are attached to the resources, which are used to authorise users.
type Access struct {
	ID          rsc.ID          `json:"id,omitempty"`
	Key         rsc.Key         `json:"key,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Name        rsc.Name        `json:"name,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
	Secret      string          `json:"secret,omitempty"`
	Type        string          `json:"type,omitempty"`
	ExpiresAt   int64           `json:"expiresAt,omitempty"`
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
