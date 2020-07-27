package project

import (
	"context"
	"core/internal/db"
	rsc "core/internal/resource"
	"fmt"
)

func getByKey(key rsc.Key) (*Project, error) {
	var w Project
	row := db.Pool.QueryRow(context.Background(), `
  SELECT
    id, key, name, description, tags
  FROM
    project
  WHERE
    key = $1
  `, key)
	if err := row.Scan(
		&w.ID,
		&w.Key,
		&w.Name,
		&w.Description,
		&w.Tags,
	); err != nil {
		return &w, fmt.Errorf("Unable to find project with key %s", key)
	}

	return &w, nil
}
