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
	rootPath := ""
	routes.GET(rootPath, httputil.Handler(sctx, getEvaluationAPIHandler))
	routes.POST(rootPath, httputil.Handler(sctx, evaluateAPIHandler))
}

func getEvaluationAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	etag := ctx.Request.Header.Get("ETag")

	data, retag, _e := Get(
		sctx,
		httputil.SecureOverideATK(sctx),
		etag,
		RootHeaders{
			SDKKey: ctx.Request.Header.Get("x-sdk-key"),
		},
	)
	if !_e.IsEmpty() {
		e.Extend(_e)
	}

	ctx.Header("ETag", retag)
	statusCode := http.StatusOK
	if e.IsEmpty() && retag == etag {
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

	etag := ctx.Request.Header.Get("ETag")

	var ectx evaluator.Context
	if err := ctx.BindJSON(&ectx); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, retag, _e := Evaluate(
		sctx,
		httputil.SecureOverideATK(sctx),
		etag,
		ectx,
		RootHeaders{
			SDKKey: ctx.Request.Header.Get("x-sdk-key"),
		},
	)
	if !_e.IsEmpty() {
		e.Extend(_e)
	}

	ctx.Header("ETag", retag)
	statusCode := http.StatusOK
	if e.IsEmpty() && retag == etag {
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
