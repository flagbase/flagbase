package httputils

import (
	"strings"

	"github.com/gin-gonic/gin"
)

// RetrieveAccessToken get access token from request context
func RetrieveAccessToken(ctx *gin.Context) string {
	rtk := ctx.Request.Header.Get("Authorization")
	stk := strings.Split(rtk, "Bearer ")
	atk := stk[1]
	return atk
}
