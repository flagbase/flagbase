package workspace

import (
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteWorkspace)
	resourcePath := httputil.BuildPath(
		rsc.WorkspaceKey,
	)

	routes.GET("", httputil.Handler(senv, listAPIHandler))
	routes.POST("", httputil.Handler(senv, createAPIHandler))
	routes.GET(resourcePath, httputil.Handler(senv, getAPIHandler))
	routes.PATCH(resourcePath, httputil.Handler(senv, updateAPIHandler))
	routes.DELETE(resourcePath, httputil.Handler(senv, deleteAPIHandler))
}

func listAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := List(senv, atk, RootArgs{})
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func createAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i Workspace
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := Create(senv, atk, i, RootArgs{})
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusCreated,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func getAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := Get(
		senv,
		atk,
		ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func updateAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := Update(
		senv,
		atk,
		i,
		ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func deleteAPIHandler(senv *srvenv.Env, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := Delete(
		senv,
		atk,
		ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
		},
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputil.Send(
		ctx,
		http.StatusNoContent,
		&res.Success{},
		http.StatusInternalServerError,
		e,
	)
}
