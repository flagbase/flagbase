package authutil

import (
	"context"
	accessmodel "core/internal/app/access/model"
	accessrepo "core/internal/app/access/repository"
	cons "core/internal/pkg/constants"
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
) (*accessmodel.Access, error) {
	// bypass auth for internal operations using secure runtime hash
	if reflect.DeepEqual(
		atk,
		httputil.SecureOverideATK(senv),
	) {
		return &accessmodel.Access{
			ID:        "some-id",
			Key:       "system",
			Secret:    cons.ServiceHiddenText,
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

	if _, err := accessrepo.NewRepo(senv).Get(context.Background(), accessmodel.KeySecretPair{
		Key:    a.Key.String(),
		Secret: a.Secret,
	}); err != nil {
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
