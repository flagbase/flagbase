package api

import (
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	ginlogrus "github.com/toorop/gin-logrus"
)

// NewServer initialize a new gin-based HTTP server
func NewServer(host string, port string, debug bool) {
	if !debug {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	if debug {
		r.Use(ginlogrus.Logger(logrus.New()), gin.Recovery())
	}

	ApplyRoutes(r)

	err := r.Run(host + ":" + port)
	if err != nil {
		logrus.Error("Unable to start HTTP server: ", err)
	}
}
