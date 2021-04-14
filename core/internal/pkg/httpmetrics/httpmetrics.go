package httpmetrics

import (
	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

// ApplyMetrics apply metrics to routes
func ApplyMetrics(r *gin.Engine, name string) {
	p := ginprometheus.NewPrometheus(name)
	p.Use(r)
}
