package transport

import (
	healthcheckservice "core/internal/app/healthcheck/service"
	res "core/pkg/response"
	"net/http"

	"core/internal/pkg/httputil"
	"core/internal/pkg/srvenv"

	"github.com/gin-gonic/gin"
)

// APIHandler API handler context
type APIHandler struct {
	Senv               *srvenv.Env
	HealthCheckService *healthcheckservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:               senv,
		HealthCheckService: healthcheckservice.NewService(senv),
	}
}

// ApplyRoutes healthcheck route handler
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	r.GET("healthcheck", h.healthCheckAPIHandler)
}

func (h *APIHandler) healthCheckAPIHandler(ctx *gin.Context) {
	r := h.HealthCheckService.HealthCheck()

	httputil.SendJSON(
		ctx,
		http.StatusOK,
		r,
		http.StatusInternalServerError,
		res.Errors{
			Errors: []*res.Error{},
		},
	)
}
