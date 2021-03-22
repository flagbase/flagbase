package segmentrule

import (
	cons "core/internal/pkg/constants"
	"core/pkg/httputils"
	"core/pkg/patch"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes segment route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteSegmentRule)
	rootPath := httputils.BuildPath(
		rsc.WorkspaceKey,
		rsc.ProjectKey,
		rsc.SegmentKey,
	)
	resourcePath := httputils.AppendPath(
		rootPath,
		rsc.RuleKey,
	)

	routes.GET(rootPath, listHTTPHandler)
	routes.POST(rootPath, createHTTPHandler)
	routes.GET(resourcePath, getHTTPHandler)
	routes.PATCH(resourcePath, updateHTTPHandler)
	routes.DELETE(resourcePath, deleteHTTPHandler)
}

func listHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := List(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.SegmentKey),
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

func createHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i SegmentRule
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Create(
		atk,
		i,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.SegmentKey),
	)
	if !_err.IsEmpty() {
		e.Extend(_err)
	}

	httputils.Send(
		ctx,
		http.StatusCreated,
		data,
		http.StatusInternalServerError,
		e,
	)
}

func getHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := Get(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.SegmentKey),
		httputils.GetParam(ctx, rsc.RuleKey),
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

func updateHTTPHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	data, _err := Update(
		atk,
		i,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.SegmentKey),
		httputils.GetParam(ctx, rsc.RuleKey),
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

func deleteHTTPHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := Delete(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.SegmentKey),
		httputils.GetParam(ctx, rsc.RuleKey),
	); !err.IsEmpty() {
		e.Extend(err)
	}

	httputils.Send(
		ctx,
		http.StatusNoContent,
		&res.Success{},
		http.StatusInternalServerError,
		e,
	)
}
