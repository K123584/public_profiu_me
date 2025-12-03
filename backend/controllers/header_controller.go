package controllers

import (
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-gonic/gin"
)

func HeaderGet(c *gin.Context) {

	// session := sessions.Default(c)
	// username := session.Get("user")
	username := c.Param("username")

	var user models.User
	if err := models.DB.Where("username = ?", username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var header models.Header
	if err := models.DB.Where("id = ?", user.ID).First(&header).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Header not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   header,
	})

	// 	sqlStatement := `
	// 	SELECT *
	// 	FROM header AS h
	// 	RIGHT JOIN users AS u
	// 	ON h.id = u.id WHERE u.username = ?
	// `

	// 	rows, err := models.DB.Raw(sqlStatement, username).Rows()

	// if err != nil {
	// 	c.JSON(404, gin.H{"error": "can't find user"})
	// 	return
	// }
	// defer rows.Close()
	// // var h Header

	// if rows.Next() {
	// 	if err := models.DB.ScanRows(rows, &header); err != nil {
	// 		c.JSON(500, gin.H{"error": "Fail Scan"})
	// 		return
	// 	}
	// } else {
	// 	c.JSON(404, gin.H{"error": "No headers found"})
	// 	return
	// }

	// c.JSON(200, header)

}

func HeaderPost(c *gin.Context) {
	p_username := c.Param("username")

	var existingUser models.UserHeader
	// var existingUser User

	checkStatement := `
        SELECT *
        FROM header AS h
        RIGHT JOIN users AS u
        ON h.id = u.id WHERE u.username = ?
    `

	if err := models.DB.Raw(checkStatement, p_username).Scan(&existingUser).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	var h models.Header

	if err := c.ShouldBindJSON(&h); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.ID = existingUser.ID
	if err := models.DB.Where(models.Header{ID: h.ID}).Assign(h).FirstOrCreate(&h).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
