package service

import (
	"io/ioutil"
	"log"

	"github.com/sirupsen/logrus"
)

// ServiceStreamerConfig API service configuration
type ServiceStreamerConfig struct {
	Host         string
	StreamerPort int
	DBURL        string
	Verbose      bool
}

// StartStreamer start streamer
func StartStreamer(cnf ServiceStreamerConfig) {
	if !cnf.Verbose {
		log.SetOutput(ioutil.Discard)
		logrus.SetOutput(ioutil.Discard)
	}

	logrus.WithFields(logrus.Fields{
		"host":     cnf.Host,
		"httpPort": cnf.StreamerPort,
		"dbURL":    cnf.DBURL,
		"verbose":  cnf.Verbose,
	}).Info("Starting Streamer")

	logrus.Warn("Streamer has not been implemented yet.")
}
