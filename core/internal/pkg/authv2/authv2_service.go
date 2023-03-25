package authv2

import (
	"core/internal/app/access/model"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
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
