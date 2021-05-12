package service

import (
	"context"
	"core/internal/pkg/srvenv"
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
func (s *Service) HealthCheck() (string, error) {
	var msg string
	row := s.Senv.DB.QueryRow(context.Background(), "SELECT 'OK'")
	if err := row.Scan(&msg); err != nil {
		s.Senv.Log.Error().Msg(err.Error())
		return "error", err
	}

	return msg, nil
}
