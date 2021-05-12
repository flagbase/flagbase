package transport

import (
	accessmodel "core/internal/app/access/model"
	accessservice "core/internal/app/access/service"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIHandler API handler context
type APIHandler struct {
	Senv          *srvenv.Env
	AccessService *accessservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:          senv,
		AccessService: accessservice.NewService(senv),
	}
}

// ApplyRoutes access route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group(rsc.RouteAccess)
	routes.POST("/token", h.generateTokenAPIHandler)
}

func (h *APIHandler) generateTokenAPIHandler(ctx *gin.Context) {
	var i accessmodel.KeySecretPair
	if err := ctx.BindJSON(&i); err != nil {
		return
	}

	r, err := h.AccessService.GenerateToken(i)
	if err.Errors != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, err)
		return
	}

	ctx.JSON(http.StatusOK, &res.Success{
		Data: r,
	})
}
