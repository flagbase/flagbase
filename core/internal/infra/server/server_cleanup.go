package server

import "core/internal/pkg/srvenv"

// Cleanup close active server connections
func Cleanup(senv *srvenv.Env) {
	senv.DB.Close()
	senv.Cache.Close()
}
