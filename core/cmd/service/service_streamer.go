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
func StartStreamer(cnf StreamerConfig) {
	if !cnf.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":     cnf.Host,
		"httpPort": cnf.StreamerPort,
		"dbURL":    cnf.PGConnStr,
		"verbose":  cnf.Verbose,
	}).Info("Starting Streamer")

	logrus.Warn("Streamer has not been implemented yet.")
}
