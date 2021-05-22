package poller

import (
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httpmetrics"
	"core/internal/pkg/httputil"
	"core/internal/pkg/srvenv"
	"core/pkg/evaluator"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes applies route from all packages to root handler
func ApplyRoutes(senv *srvenv.Env, r *gin.Engine) {
	httpmetrics.ApplyMetrics(r, "poller")
	rootPath := ""
	routes := r.Group(rootPath)
	routes.GET(rootPath, httputil.Handler(senv, getEvaluationAPIHandler))
	routes.POST(rootPath, httputil.Handler(senv, evaluateAPIHandler))
}

func getEvaluationAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors

	etag := ctx.Request.Header.Get("ETag")

	r, retag, _e := Get(
		senv,
		httputil.SecureOverideATK(senv),
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

	httputil.SendJSON(
		ctx,
		statusCode,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func evaluateAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors

	etag := ctx.Request.Header.Get("ETag")

	var ectx evaluator.Context
	if err := ctx.BindJSON(&ectx); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, retag, _e := Evaluate(
		senv,
		httputil.SecureOverideATK(senv),
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

	httputil.SendJSON(
		ctx,
		statusCode,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}
