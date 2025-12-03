package controllers

import (
	"github.com/K123584/webmoire/models"
	"github.com/gin-gonic/gin"
)

func OpenHeaderGet(c *gin.Context) {
	username := c.Param("username")

	var header models.Header

	// var existingUser UserHeader

	sqlStatement := `
	SELECT *
	FROM header AS h
	RIGHT JOIN users AS u
	ON h.id = u.id WHERE u.username = ?
`

	rows, err := models.DB.Raw(sqlStatement, username).Rows()

	if err != nil {
		c.JSON(404, gin.H{"error": "can't find user"})
		return
	}
	defer rows.Close()

	if rows.Next() {
		if err := models.DB.ScanRows(rows, &header); err != nil {
			c.JSON(500, gin.H{"error": "Fail Scan"})
			return
		}
	} else {
		c.JSON(404, gin.H{"error": "No headers found"})
		return
	}

	c.JSON(200, header)

}
