package access

import (
	"core/generated/models"
	"core/internal/constants"
	"core/internal/httputils"
	"core/internal/rand"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group("access")
	routes.POST("", createAccessHandler)
	routes.POST("/token", genAccessTokenHandler)
}

func createAccessHandler(ctx *gin.Context) {
	// retrieve access token
	atk := httputils.RetrieveAccessToken(ctx)

	// bind req body to input
	var i models.Access
	ctx.BindJSON(&i)

	// default values
	i.Key = rand.String(20)    // generate a key
	i.Secret = rand.String(30) // generate a secret
	if i.ExpiresAt == 0 {
		i.ExpiresAt = constants.MaxUnixTime
	}
	if i.Type == "" {
		i.Type = models.AccessInputTypeService
	}
	if i.Tags == nil {
		i.Tags = []string{}
	}

	// TODO retreive token from context
	data, err := CreateAccess(atk, i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(201, data)
}

func genAccessTokenHandler(ctx *gin.Context) {
	var i models.AccessPairInput
	ctx.BindJSON(&i)

	data, err := GenAccessToken(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(500, err)
		return
	}

	ctx.JSON(200, data)
}
