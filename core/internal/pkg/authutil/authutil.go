package authutil

import (
	"core/internal/app/access/model"
	accessmodel "core/internal/app/access/model"
	"core/internal/pkg/httputil"
	"core/internal/pkg/jwt"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"encoding/json"
	"reflect"
)

// Authorize checks if an access token is of a desired type
func Authorize(
	senv *srvenv.Env,
	atk rsc.Token,
) (*model.Access, error) {
	// bypass auth for internal operations using secure runtime hash
	if reflect.DeepEqual(
		atk,
		httputil.SecureOverideATK(senv),
	) {
		return &model.Access{
			ID:        "some-id",
			Key:       "system",
			Secret:    "****",
			Scope:     "instance",
			Type:      "root",
			Name:      "System",
			Tags:      rsc.Tags{"internal"},
			ExpiresAt: 0,
		}, nil
	}

	a, err := getAccessFromToken(atk)
	if err != nil {
		return nil, err
	}

	return a, nil
}

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
