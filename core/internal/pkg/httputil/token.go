package httputil

import (
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"errors"
	"strings"

	"github.com/gin-gonic/gin"
)

// ExtractATK get access token from request context
func ExtractATK(ctx *gin.Context) (rsc.Token, error) {
	rtk := ctx.Request.Header.Get("Authorization")
	if rtk == "" {
		return "", errors.New("unable to get access token from request headers")
	}

	stk := strings.Split(rtk, "Bearer ")
	if len(stk) == 1 {
		return "", errors.New("make sure authorization header is a Bearer token")
	}

	atk := rsc.Token(stk[1])

	return atk, nil
}

// SecureOverideATK get security token to overide protected operations
func SecureOverideATK(senv *srvenv.Env) rsc.Token {
	return rsc.Token(senv.SecureRuntimeHash)
}
