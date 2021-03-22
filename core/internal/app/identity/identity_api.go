package identity

import (
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	"core/pkg/httputils"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes identity route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteIdentity)
	rootPath := httputils.BuildPath(
		rsc.WorkspaceKey,
		rsc.ProjectKey,
		rsc.EnvironmentKey,
	)
	resourcePath := httputils.AppendPath(
		rootPath,
		rsc.IdentityKey,
	)

	routes.GET(rootPath, listAPIHandler)
	routes.GET(resourcePath, getAPIHandler)
	routes.DELETE(resourcePath, deleteAPIHandler)
}

func listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := List(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.EnvironmentKey),
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

func getAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := Get(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.EnvironmentKey),
		httputils.GetParam(ctx, rsc.IdentityKey),
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

func deleteAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputils.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := Delete(
		atk,
		httputils.GetParam(ctx, rsc.WorkspaceKey),
		httputils.GetParam(ctx, rsc.ProjectKey),
		httputils.GetParam(ctx, rsc.EnvironmentKey),
		httputils.GetParam(ctx, rsc.IdentityKey),
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
