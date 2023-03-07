package service

import (
	"context"
	healthcheckmodel "core/internal/app/healthcheck/model"
	"core/internal/pkg/srvenv"

	"github.com/google/uuid"
)

type Service struct {
	Senv *srvenv.Env
}

func NewService(senv *srvenv.Env) *Service {
	return &Service{
		Senv: senv,
	}
}

// HealthCheck sends a useless query to the database to see if the connection is working.
func (s *Service) HealthCheck() *healthcheckmodel.HealthStatus {
	status := "OK"

	// cache status
	cacheStatus := "OK"
	cachePing := s.Senv.Cache.Ping()
	if err := cachePing.Err(); err != nil {
		s.Senv.Log.Error().Msg(err.Error())
		cacheStatus = "ERR: " + err.Error()
		status = "FAIL"
	}

	// db status
	var DBStatus string
	row := s.Senv.DB.QueryRow(context.Background(), "SELECT 'OK'")
	if err := row.Scan(&DBStatus); err != nil {
		s.Senv.Log.Error().Msg(err.Error())
		DBStatus = "ERR: " + err.Error()
		status = "FAIL"
	}

	return &healthcheckmodel.HealthStatus{
		ID:     uuid.New().String(),
		Status: status,
		Resources: healthcheckmodel.ResourceState{
			DB:    DBStatus,
			Cache: cacheStatus,
		},
	}
}
