package healthcheck

import (
	"context"
	"core/internal/db"

	"github.com/sirupsen/logrus"
)

// HealthCheck sends a useless query to the database to see if the connection is working.
func HealthCheck(ctx context.Context) (string, error) {
	var msg string
	row := db.Pool.QueryRow(ctx, "SELECT 'OK'")
	err := row.Scan(&msg)
	if err != nil {
		logrus.Error(err)
		return "error", err
	}
	return msg, nil
}
