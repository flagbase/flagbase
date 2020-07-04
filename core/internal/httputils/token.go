package httputils

import (
	"core/internal/resource"
	"strings"

	"github.com/gin-gonic/gin"
)

// RetrieveAccessToken get access token from request context
func RetrieveAccessToken(ctx *gin.Context) resource.Token {
	rtk := ctx.Request.Header.Get("Authorization")
	stk := strings.Split(rtk, "Bearer ")
	atk := resource.Token(stk[1])
	return atk
}
