package controllers

import (
	"log"
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	// "github.com/jinzhu/gorm"
)

func NewsListGet(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

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

func NewsListDeatilGet(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	current_id := c.Param("id")

	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var newsList models.NewsList
	if err := models.DB.Where("user_id = ? AND news_id = ?", user.ID, current_id).Find(&newsList).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve news lists"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   newsList,
	})

}

func NewListIns(c *gin.Context) {
	// p_username := c.Param("username")
	session := sessions.Default(c)
	username := session.Get("user")

	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var nl models.NewsList
	if err := c.ShouldBindJSON(&nl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	nl.UserID = user.ID

	if err := models.DB.Create(&nl).Error; err != nil {
		log.Println("Error inserting data:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "NewsList created successfully",
		"data":    nl,
	})
}

func NewsListUpdate(c *gin.Context) {
	// p_username := c.Param("username")
	session := sessions.Default(c)
	username := session.Get("user")

	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var nl models.NewsList
	if err := c.ShouldBindJSON(&nl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	nl.UserID = user.ID

	err := models.DB.Model(&models.NewsList{}).
		Where("news_id = ?", nl.News_id).
		Updates(models.NewsList{
			ArticleTitle:   nl.ArticleTitle,
			ArticleContent: nl.ArticleContent,
		}).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "NewsList updated successfully",
		"data":    nl,
	})
}

func NewsListDelete(c *gin.Context) {
	// p_username := c.Param("username")
	session := sessions.Default(c)
	username := session.Get("user")

	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	newsID := c.Param("id")

	if err := models.DB.Where("news_id = ? AND user_id = ?", newsID, user.ID).Delete(&models.NewsList{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "NewsList deleted successfully",
	})
}
