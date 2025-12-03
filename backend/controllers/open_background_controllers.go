package controllers

import (
	"github.com/K123584/webmoire/models"
	"github.com/gin-gonic/gin"
)

func OpenBackgroundGet(c *gin.Context) {
	username := c.Param("username")

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
