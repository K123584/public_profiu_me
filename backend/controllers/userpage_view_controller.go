package controllers

import (
	// "fmt"
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-gonic/gin"
)

func UserPageView(c *gin.Context) {
	username := c.Param("username")

	// ユーザー情報取得
	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// レスポンス用の構造体データ
	response := gin.H{
		"id":       user.ID,
		"username": user.Username,
	}

	c.JSON(http.StatusOK, response)
}
