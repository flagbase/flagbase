package model

import rsc "core/internal/pkg/resource"

// SDKKey is used to provide fast access to a particular environment
type SDKKey struct {
	ID          string          `json:"id" jsonapi:"primary,sdk_key"`
	Enabled     bool            `json:"enabled,omitempty" jsonapi:"attr,enabled,omitempty"`
	ClientKey   string          `json:"clientKey" jsonapi:"attr,clientKey"`
	ServerKey   string          `json:"serverKey" jsonapi:"attr,serverKey"`
	ExpiresAt   int64           `json:"expiresAt,omitempty" jsonapi:"attr,expiresAt,omitempty"`
	Name        rsc.Name        `json:"name,omitempty" jsonapi:"attr,name,omitempty"`
	Description rsc.Description `json:"description,omitempty" jsonapi:"attr,description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty" jsonapi:"attr,tags,omitempty"`
}
