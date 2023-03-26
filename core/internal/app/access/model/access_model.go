package model

import rsc "core/internal/pkg/resource"

// Access is used to represent the relationship between the API user and the service.
// Access objects are attached to the resources, which are used to authorise users.
type Access struct {
	ID           string          `json:"id,omitempty" jsonapi:"primary,access"`
	Key          rsc.Key         `json:"key,omitempty" jsonapi:"attr,key"`
	Description  rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Name         rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Tags         rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
	Secret       string          `json:"secret,omitempty" jsonapi:"attr,secret,omitempty"`
	Type         string          `json:"type,omitempty" jsonapi:"attr,type,omitempty"`
	Scope        string          `json:"scope,omitempty" jsonapi:"attr,scope,omitempty"`
	WorkspaceKey string          `json:"workspaceKey,omitempty" jsonapi:"attr,workspaceKey,omitempty"`
	ProjectKey   string          `json:"projectKey,omitempty" jsonapi:"attr,projectKey,omitempty"`
	ExpiresAt    int64           `json:"expiresAt,omitempty" jsonapi:"attr,expiresAt,omitempty"`
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
