package polling

import (
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httpmetrics"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/evaluator"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(sctx *srv.Ctx, r *gin.Engine) {
	httpmetrics.ApplyMetrics(r, "polling")
	routes := r.Group(rsc.RoutePolling)
	rootPath := httputil.BuildPath(
		rsc.WorkspaceKey,
		rsc.ProjectKey,
		rsc.EnvironmentKey,
	)

	routes.GET(rootPath, httputil.Handler(sctx, getEvaluationAPIHandler))
	routes.POST(rootPath, httputil.Handler(sctx, evaluateAPIHandler))
}

func getEvaluationAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	etag := ctx.Request.Header.Get("ETag")

	data, retag, _err := Get(
		sctx,
		atk,
		etag,
		RootArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	ctx.Header("ETag", retag)
	statusCode := http.StatusOK
	if _err.IsEmpty() && retag == etag {
		statusCode = http.StatusNotModified
	}

	httputil.Send(
		ctx,
		statusCode,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func evaluateAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	etag := ctx.Request.Header.Get("ETag")

	var i evaluator.Context
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, retag, _err := Evaluate(
		sctx,
		atk,
		etag,
		i,
		RootArgs{
			WorkspaceKey:   httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:     httputil.GetParam(ctx, rsc.ProjectKey),
			EnvironmentKey: httputil.GetParam(ctx, rsc.EnvironmentKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	ctx.Header("ETag", retag)
	statusCode := http.StatusOK
	if _err.IsEmpty() && retag == etag {
		statusCode = http.StatusNotModified
	}

	httputil.Send(
		ctx,
		statusCode,
		data,
		http.StatusInternalServerError,
		e,
	)
}
