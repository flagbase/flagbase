package evaluation

import (
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/pkg/httputils"
	"core/pkg/patch"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes environment route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteEvaluate)
	rootPath := httputils.BuildPath(
		rsc.WorkspaceKey,
		rsc.ProjectKey,
		rsc.EnvironmentKey
	)
	routes.POST(rootPath, evaluateHTTPHandler)
}

func evaluateHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i Evaluation
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Create(
		atk,
		i,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}
