package healthcheck

import (
	"context"
	srv "core/internal/pkg/server"
)

// HealthCheck sends a useless query to the database to see if the connection is working.
func HealthCheck(sctx *srv.Ctx, ctx context.Context) (string, error) {
	var msg string
	row := sctx.DB.QueryRow(ctx, "SELECT 'OK'")
	if err := row.Scan(&msg); err != nil {
		sctx.Log.Error.Msg(err.Error())
		return "error", err
	}

	return msg, nil
}
