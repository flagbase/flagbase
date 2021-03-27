package service

import (
	"io/ioutil"
	"log"

	"github.com/sirupsen/logrus"
)

// StreamerConfig API service configuration
type StreamerConfig struct {
	Host         string
	StreamerPort int
	PGConnStr    string
	Verbose      bool
}

// StartStreamer start streamer
func StartStreamer(cfg StreamerConfig) {
	if !cfg.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":     cfg.Host,
		"httpPort": cfg.StreamerPort,
		"dbURL":    cfg.PGConnStr,
		"verbose":  cfg.Verbose,
	}).Info("Starting Streamer")

	logrus.Warn("Streamer has not been implemented yet.")
}
