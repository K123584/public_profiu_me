package controllers

import (
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func BackgroundGet(c *gin.Context) {
	// username := c.Param("username")
	session := sessions.Default(c)
	username := session.Get("user")

	var bg models.Background

	sqlStatement := `
	SELECT *
	FROM background AS b
	RIGHT JOIN users AS u
	ON b.id = u.id WHERE u.username = ?
`

	rows, err := models.DB.Raw(sqlStatement, username).Rows()

	if err != nil {
		c.JSON(404, gin.H{"error": "can't find user"})
		return
	}
	defer rows.Close()

	if rows.Next() {
		if err := models.DB.ScanRows(rows, &bg); err != nil {
			c.JSON(500, gin.H{"error": "Fail Scan"})
			return
		}
	} else {
		c.JSON(404, gin.H{"error": "No backgrounds found"})
		return
	}

	c.JSON(200, bg)

}

func BackgroundUpdate(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	var existingUser models.UserBg

	var bg models.Background

	checkStatement := `
		SELECT *
		FROM background AS b
		RIGHT JOIN users AS u
		ON b.id = u.id WHERE u.username = ?
	`

	if err := models.DB.Raw(checkStatement, username).Scan(&existingUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	if err := c.ShouldBindJSON(&bg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	bg.ID = existingUser.ID
	if err := models.DB.Model(&models.Background{}).Where("id = ?", bg.ID).Updates(bg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
