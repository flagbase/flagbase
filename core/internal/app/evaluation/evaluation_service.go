package evaluation

import (
	"context"
	"core/internal/app/auth"
	cons "core/internal/pkg/constants"
	rsc "core/internal/pkg/resource"
	res "core/pkg/response"
)

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func Evaluate(
	atk rsc.Token,
	i Evaluation,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Evaluation
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	return &res.Success{Data: o}, &e
}
