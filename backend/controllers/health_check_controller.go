package controllers

import "github.com/gin-gonic/gin"

func HealthCheckController(c *gin.Context) {
	c.JSON(200, gin.H{"status": "ok"})
}
