package logger

import (
	"io/ioutil"
	"os"

	"github.com/rs/zerolog"
)

type Logger struct {
	Logger *zerolog.Logger
	Panic  *zerolog.Event
	Fatal  *zerolog.Event
	Error  *zerolog.Event
	Warn   *zerolog.Event
	Info   *zerolog.Event
	Debug  *zerolog.Event
}

type Config struct {
	Verbose bool
}

func New(cnf Config) *Logger {
	var logger zerolog.Logger
	if cnf.Verbose {
		logger = zerolog.New(
			zerolog.ConsoleWriter{Out: os.Stderr},
		)
	} else {
		logger = zerolog.New(ioutil.Discard)
	}

	return &Logger{
		Logger: &logger,
		Panic:  logger.Panic(),
		Fatal:  logger.Fatal(),
		Error:  logger.Error(),
		Warn:   logger.Warn(),
		Info:   logger.Info(),
		Debug:  logger.Debug(),
	}
}
