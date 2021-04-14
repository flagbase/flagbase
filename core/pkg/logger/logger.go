package logger

import (
	"io/ioutil"
	"os"

	"github.com/rs/zerolog"
)

// Logger wrapper around zerolog
type Logger struct {
	Logger *zerolog.Logger
	Panic  func() *zerolog.Event
	Fatal  func() *zerolog.Event
	Error  func() *zerolog.Event
	Warn   func() *zerolog.Event
	Info   func() *zerolog.Event
	Debug  func() *zerolog.Event
}

// Config logger configuration
type Config struct {
	Verbose bool
}

// New init a new logger instance
func New(cfg Config) *Logger {
	var logger zerolog.Logger
	if cfg.Verbose {
		logger = zerolog.New(
			zerolog.ConsoleWriter{Out: os.Stderr},
		)
	} else {
		logger = zerolog.New(ioutil.Discard)
	}

	return &Logger{
		Logger: &logger,
		Panic:  func() *zerolog.Event { return logger.Panic() },
		Fatal:  func() *zerolog.Event { return logger.Fatal() },
		Error:  func() *zerolog.Event { return logger.Error() },
		Warn:   func() *zerolog.Event { return logger.Warn() },
		Info:   func() *zerolog.Event { return logger.Info() },
		Debug:  func() *zerolog.Event { return logger.Debug() },
	}
}
