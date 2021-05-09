package healthcheck

import (
	"context"
	"core/internal/pkg/srvenv"
)

// HealthCheck sends a useless query to the database to see if the connection is working.
func HealthCheck(senv *srvenv.Env) (string, error) {
	var msg string
	row := senv.DB.QueryRow(context.Background(), "SELECT 'OK'")
	if err := row.Scan(&msg); err != nil {
		senv.Log.Error().Msg(err.Error())
		return "error", err
	}

	return msg, nil
}
