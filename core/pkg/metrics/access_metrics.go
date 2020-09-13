package metrics

import (
	"github.com/gin-gonic/gin"
	ginprometheus "github.com/zsais/go-gin-prometheus"
)

// ApplyRoutes workspace route handlers
func ApplyRoutes(r *gin.Engine) {
	p := ginprometheus.NewPrometheus("gin")
	p.Use(r)
}
