package controllers

import (
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func OpenNewsListGet(c *gin.Context) {
	username := c.Param("username")

	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var newsLists []models.NewsList
	if err := models.DB.Where("user_id = ?", user.ID).Find(&newsLists).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve news lists"})
		return
	}

	if len(newsLists) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "No news lists found",
			"data":    []models.NewsList{},
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newsLists,
	})

}

func OpenNewsListDeatilGet(c *gin.Context) {
	username := c.Param("username")

	current_id := c.Param("id")

	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var newsList models.NewsList
	err := models.DB.Where("user_id = ? AND news_id = ?", user.ID, current_id).Find(&newsList).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "News not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve news lists"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newsList,
	})

}
