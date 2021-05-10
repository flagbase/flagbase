package segment

import (
	segmentmodel "core/internal/app/segment/model"
	segmentservice "core/internal/app/segment/service"
	"core/internal/app/segmentrule"
	cons "core/internal/pkg/constants"
	"core/internal/pkg/httputil"
	rsc "core/internal/pkg/resource"
	"core/internal/pkg/srvenv"
	"core/pkg/patch"
	res "core/pkg/response"
	"net/http"

	"github.com/gin-gonic/gin"
)

// APIHandler API handler context
type APIHandler struct {
	Senv           *srvenv.Env
	SegmentService *segmentservice.Service
}

func newAPIHandler(senv *srvenv.Env) *APIHandler {
	return &APIHandler{
		Senv:           senv,
		SegmentService: segmentservice.NewService(senv),
	}
}

// ApplyRoutes segment route handlers
func ApplyRoutes(senv *srvenv.Env, r *gin.RouterGroup) {
	h := newAPIHandler(senv)
	routes := r.Group(rsc.RouteSegment)

	rootPath := httputil.BuildPath(
		rsc.WorkspaceKey,
		rsc.ProjectKey,
	)
	resourcePath := httputil.AppendPath(
		rootPath,
		rsc.SegmentKey,
	)

	routes.GET(rootPath, h.listAPIHandler)
	routes.POST(rootPath, h.createAPIHandler)
	routes.GET(resourcePath, h.getAPIHandler)
	routes.PATCH(resourcePath, h.updateAPIHandler)
	routes.DELETE(resourcePath, h.deleteAPIHandler)
	segmentrule.ApplyRoutes(senv, routes)
}

func (h *APIHandler) listAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := h.SegmentService.List(
		atk,
		segmentmodel.RootArgs{
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
		&res.Success{
			Data: r,
		},
		http.StatusInternalServerError,
		e,
	)
}

func (h *APIHandler) createAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	var i segmentmodel.Segment
	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.SegmentService.Create(
		atk,
		i,
		segmentmodel.RootArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
		},
	)
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

func (h *APIHandler) getAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	r, _err := h.SegmentService.Get(
		atk,
		segmentmodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			SegmentKey:   httputil.GetParam(ctx, rsc.SegmentKey),
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

func (h *APIHandler) updateAPIHandler(ctx *gin.Context) {
	var e res.Errors
	var i patch.Patch

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := ctx.BindJSON(&i); err != nil {
		e.Append(cons.ErrorInternal, err.Error())
	}

	r, _err := h.SegmentService.Update(
		atk,
		i,
		segmentmodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			SegmentKey:   httputil.GetParam(ctx, rsc.SegmentKey),
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

func (h *APIHandler) deleteAPIHandler(ctx *gin.Context) {
	var e res.Errors

	atk, err := httputil.ExtractATK(ctx)
	if err != nil {
		e.Append(cons.ErrorAuth, err.Error())
	}

	if err := h.SegmentService.Delete(
		atk,
		segmentmodel.ResourceArgs{
			WorkspaceKey: httputil.GetParam(ctx, rsc.WorkspaceKey),
			ProjectKey:   httputil.GetParam(ctx, rsc.ProjectKey),
			SegmentKey:   httputil.GetParam(ctx, rsc.SegmentKey),
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
