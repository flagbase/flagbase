package workspace

import (
	"context"
	"core/internal/db"
	"errors"

	"github.com/jackc/pgx"
	"github.com/sirupsen/logrus"
)

// Workspace represents a collection of projects
type Workspace struct {
	Key         string   `json:"key"`
	Name        string   `json:"name,omitempty"`
	Description string   `json:"description,omitempty"`
	Tags        []string `json:"tags,omitempty"`
}

// GetWorkspace get a workspace using its key
func GetWorkspace(ctx context.Context, key string) (*Workspace, error) {
	var w Workspace
	row := db.Pool.QueryRow(ctx, `
  SELECT
    key, name
  FROM
    workspace
  WHERE
    key = $1
  `, key)
	err := row.Scan(&w.Key, &w.Name)
	if err == pgx.ErrNoRows {
		logrus.Error(err)
		return nil, errors.New("Cannot find workspace")
	} else if err != nil {
		logrus.Error(err)
		return nil, err
	}
	return &w, nil
}
