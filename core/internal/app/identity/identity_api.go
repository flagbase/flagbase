package identity

import (
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ApplyRoutes identity route handlers
func ApplyRoutes(r *gin.RouterGroup) {
	routes := r.Group(rsc.RouteIdentity)
	rootPath := httputil.BuildPath(
		rsc.WorkspaceKey,
		rsc.ProjectKey,
		rsc.EnvironmentKey,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.IdentityKey,
	)

	routes.GET(rootPath, listAPIHandler)
	routes.GET(resourcePath, getAPIHandler)
	routes.DELETE(resourcePath, deleteAPIHandler)
}

func listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := List(
		atk,
		httputil.GetParam(ctx, rsc.WorkspaceKey),
		httputil.GetParam(ctx, rsc.ProjectKey),
		httputil.GetParam(ctx, rsc.EnvironmentKey),
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

func getAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	data, _err := Get(
		atk,
		httputil.GetParam(ctx, rsc.WorkspaceKey),
		httputil.GetParam(ctx, rsc.ProjectKey),
		httputil.GetParam(ctx, rsc.EnvironmentKey),
		httputil.GetParam(ctx, rsc.IdentityKey),
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

func deleteAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := Delete(
		atk,
		httputil.GetParam(ctx, rsc.WorkspaceKey),
		httputil.GetParam(ctx, rsc.ProjectKey),
		httputil.GetParam(ctx, rsc.EnvironmentKey),
		httputil.GetParam(ctx, rsc.IdentityKey),
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
