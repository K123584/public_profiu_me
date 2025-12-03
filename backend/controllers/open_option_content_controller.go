package controllers

import (
	"log"
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-gonic/gin"
)

// model-->>models/option_items.go

// model-->>OptionItemWithContent
func OpenOptionContentGet(c *gin.Context) {
	username := c.Param("username")

	// ユーザー取得
	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var result []models.OptionItemWithContent

	err := models.DB.
		Table("option_contents").
		Joins("JOIN option_items ON option_items.option_item_id = option_contents.option_item_id").
		Where("option_items.user_id = ?", user.ID).
		Order("option_items.option_item_sort_index ASC").
		Find(&result).Error

	if err != nil {
		log.Printf("Error fetching OptionContents: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   result,
	})
}
