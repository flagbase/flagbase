package workspace

import (
	"context"
	"core/internal/constants"
	"core/internal/db"
	res "core/internal/response"

	"github.com/lib/pq"
)

// Workspace represents a collection of projects
type Workspace struct {
	Key         string   `json:"key"`
	Name        string   `json:"name,omitempty"`
	Description string   `json:"description,omitempty"`
	Tags        []string `json:"tags,omitempty"`
}

// GetWorkspace get workspace service
func GetWorkspace(key string) (
	*res.Success,
	*res.Errors,
) {
	var o Workspace
	var e res.Errors

	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    key, name, description, tags
  FROM
    workspace
  WHERE
    key = $1
  `, key)
	err := row.Scan(
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	)
	if err != nil {
		e.Append("NotFound", err.Error())
	}

	return &res.Success{Data: o}, &e
}

// UpdateWorkspace update workspace service
func UpdateWorkspace(key string, i Workspace) (
	*res.Success,
	*res.Errors,
) {

	return nil, nil
}

// DeleteWorkspace delete workspace service
func DeleteWorkspace(key string) *res.Errors {

	return nil
}

// CreateWorkspace get a workspace using its key
func CreateWorkspace(i Workspace) (
	*res.Success,
	*res.Errors,
) {
	var o Workspace
	var e res.Errors

	// create root user
	row := db.Pool.QueryRow(context.Background(), `
  INSERT INTO
    workspace(
      key, name, description, tags
    )
  VALUES
    ($1, $2, $3, $4)
  RETURNING
    key, name, description, tags;`,
		i.Key,
		i.Name,
		i.Description,
		pq.Array(i.Tags),
	)
	if err := row.Scan(
		&o.Key,
		&o.Name,
		&o.Description,
		&o.Tags,
	); err != nil {
		e.Append(constants.InputError, err.Error())
	}

	return &res.Success{Data: o}, &e
}

// ListWorkspaces list workspace service
func ListWorkspaces() (
	*res.Success,
	*res.Errors,
) {
	var o []Workspace
	var e res.Errors

	rows, err := db.Pool.Query(context.Background(), `
  SELECT
    key, name, description, tags
  FROM
    workspace
  `)

	for rows.Next() {
		var w Workspace
		if err = rows.Scan(
			&w.Key,
			&w.Name,
			&w.Description,
			&w.Tags,
		); err != nil {
			e.Append("NotFound", err.Error())
		}
		o = append(o, w)
	}

	return &res.Success{Data: o}, &e
}
