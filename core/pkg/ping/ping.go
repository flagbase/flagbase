package ping

import (
	"context"
	"core/internal/db"
	"errors"

	"github.com/sirupsen/logrus"
)

// Ping sends a useless query to the database to see if the connection is working.
func Ping(ctx context.Context) (string, error) {
	var msg string
	row := db.Pool.QueryRow(ctx, "SELECT 'pong'")
	err := row.Scan(&msg)
	if err != nil {
		logrus.Error(err)
		return "error", errors.New("Cannot query db")
	} else if err != nil {
		logrus.Error(err)
		return "error", err
	}
	return msg, nil
}
