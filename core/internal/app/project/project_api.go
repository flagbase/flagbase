package project

import (
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	srv "core/internal/pkg/server"
	"core/pkg/patch"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes project route handlers
func ApplyRoutes(sctx *srv.Ctx, r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteProject)
	rootPath := httputil.BuildPath(
		rsc.WorkspaceKey,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.ProjectKey,
	)

	routes.GET(rootPath, httputil.Handler(sctx, listAPIHandler))
	routes.POST(rootPath, httputil.Handler(sctx, createAPIHandler))
	routes.GET(resourcePath, httputil.Handler(sctx, getAPIHandler))
	routes.PATCH(resourcePath, httputil.Handler(sctx, updateAPIHandler))
	routes.DELETE(resourcePath, httputil.Handler(sctx, deleteAPIHandler))
}

func listAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := List(
		sctx,
		atk,
		RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func createAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i Project
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Create(
		sctx,
		atk,
		i,
		RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusCreated,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func getAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := Get(
		sctx,
		atk,
		ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func updateAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Update(
		sctx,
		atk,
		i,
		ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
		},
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputil.Send(
		ctx,
		http.StatusOK,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func deleteAPIHandler(sctx *srv.Ctx, ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := Delete(
		sctx,
		atk,
		ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
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
