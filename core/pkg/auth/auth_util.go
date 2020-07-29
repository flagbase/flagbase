package auth

import (
	"core/internal/jwt"
	rsc "core/internal/resource"
	"core/pkg/access"
	"encoding/json"
)

// getAccessFromToken retrieves access from access token (atk)
func getAccessFromToken(atk rsc.Token) (*access.Access, error) {
	var a access.Access

	ma, err := jwt.Verify(atk)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(ma, &a); err != nil {
		return nil, err
	}

	return &a, nil
}
