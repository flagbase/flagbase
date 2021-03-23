package evaluation

import (
	"context"
	cons "core/internal/constants"
	"core/internal/db"
	rsc "core/internal/resource"
	res "core/internal/response"
	"core/pkg/auth"

	"github.com/lib/pq"
)

// Create creates a new resource instance given the resource instance
// (*) atk: access_type <= admin
func Evaluate(
	atk rsc.Token,
	i Environment,
	workspaceKey rsc.Key,
	projectKey rsc.Key,
) (*res.Success, *res.Errors) {
	var o Environment
	var e res.Errors

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// authorize operation
	if err := auth.Authorize(atk, rsc.AccessAdmin); err != nil {
		e.Append(cons.ErrorAuth, err.Error())
		cancel()
	}

	// create root user
	row := db.Pool.QueryRow(ctx, `
  INSERT INTO
    environment(key, name, description, tags, project_id)
  VALUES
    ($1, $2, $3, $4, (
        SELECT
          p.id
        FROM
          workspace w, project p
        WHERE
          w.key = $5 AND
          p.key = $6 AND
          p.workspace_id = w.id
      )
    )
  RETURNING
    id, key, name, description, tags;`,
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
		workspaceKey,
		projectKey,
	)
	if err := row.Scan(
		&o.ID,
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		e.Append(cons.ErrorInput, err.Error())
	}

	// Add policy for requesting user, after resource creation
	if e.IsEmpty() {
		err := auth.AddPolicy(atk, o.ID, rsc.Environment, rsc.AccessAdmin)
		if err != nil {
			e.Append(cons.ErrorAuth, err.Error())
		}
	}

	return &res.Success{Data: o}, &e
}
