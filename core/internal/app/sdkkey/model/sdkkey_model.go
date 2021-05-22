package model

import rsc "core/internal/pkg/resource"

// SDKKey is used to provide fast access to a particular environment
type SDKKey struct {
	ID          string          `json:"id"`
	Enabled     bool            `json:"enabled,omitempty"`
	ClientKey   string          `json:"clientKey"`
	ServerKey   string          `json:"serverKey"`
	ExpiresAt   int64           `json:"expiresAt,omitempty"`
	Name        rsc.Name        `json:"name,omitempty"`
	Description rsc.Description `json:"description,omitempty"`
	Tags        rsc.Tags        `json:"tags,omitempty"`
}
