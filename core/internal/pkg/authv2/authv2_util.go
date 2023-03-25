package authv2

import (
	accessmodel "core/internal/app/access/model"
	"core/internal/pkg/jwt"
	rsc "core/internal/pkg/resource"
	"encoding/json"
)

// getAccessFromToken retrieves access from access token (atk)
func getAccessFromToken(atk rsc.Token) (*accessmodel.Access, error) {
	var a accessmodel.Access

	ma, err := jwt.Verify(atk)
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(ma, &a); err != nil {
		return nil, err
	}

	return &a, nil
}
