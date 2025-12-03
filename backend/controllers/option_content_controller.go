package controllers

import (
	"log"
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// model-->>models/option_items.go

func OptionContentIns(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	// ユーザー取得
	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 最大ソート値を取得
	var maxSortIndex int
	models.DB.Model(&models.OptionItem{}).
		Where("user_id = ?", user.ID).
		Select("COALESCE(MAX(option_item_sort_index), 0)").
		Row().
		Scan(&maxSortIndex)

	// OptionItem を作成
	optionItem := models.OptionItem{
		UserID:              user.ID,
		OptionItemSortIndex: maxSortIndex + 1,
	}
	if err := models.DB.Create(&optionItem).Error; err != nil {
		log.Printf("Error creating OptionItem: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// JSONをバインド
	var input models.OptionContentInput
	// ShouldBindJSON-GinDoc--> https://mui.com/material-ui/react-button/#basic-button
	// ShouldBindJSON-qiita--> https://qiita.com/sedori/items/b27cf57700aac4e90967
	if err := c.ShouldBindJSON(&input); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// OptionContent を作成
	optionContent := models.OptionContent{
		OptionItemID:  optionItem.OptionItemID,
		OptionContent: input.OptionItemContent,
	}
	if err := models.DB.Create(&optionContent).Error; err != nil {
		log.Printf("Error creating OptionContent: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "OptionContent created successfully",
		"data": gin.H{
			"option_item":    optionItem,
			"option_content": optionContent,
		},
	})
}

func OptionContentUpdate(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	// ユーザー取得
	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// var update models.OptionContentUpdate
	var update models.OptionContentUpdate

	// ShouldBindJSON-GinDoc--> https://mui.com/material-ui/react-button/#basic-button
	// ShouldBindJSON-qiita--> https://qiita.com/sedori/items/b27cf57700aac4e90967
	if err := c.ShouldBindJSON(&update); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var optionContent models.OptionContent

	err := models.DB.
		Joins("JOIN option_items ON option_items.option_item_id = option_contents.option_item_id").
		Where("option_items.user_id = ?", user.ID).
		Where("option_items.option_item_id = ?", update.OptionItemID).
		First(&optionContent).Error
	if err != nil {
		log.Printf("Error finding OptionItemWithContent: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "OptionItem not found"})
		return
	}
	err = models.DB.Model(&optionContent).Update("option_content", update.OptionItemContent).Error

	if err != nil {
		log.Printf("Error updating OptionContents: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": gin.H{
			"option_content": update.OptionItemContent,
		},
	})
}

func OptionItemDelete(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	// ユーザー取得
	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var item_delete models.OptionItem
	if err := c.ShouldBindJSON(&item_delete); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Where("option_item_id = ? AND user_id = ?", item_delete.OptionItemID, user.ID).Delete(&item_delete).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "OptionItem deleted successfully",
	})
}

// model-->>OptionItemWithContent
func OptionContentGet(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	// ユーザー取得
	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
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

	// 🟡 ここで JSON にしてログ出力
	// jsonBytes, err := json.MarshalIndent(result, "", "  ")
	// if err != nil {
	// 	log.Printf("Error marshalling result: %v", err)
	// } else {
	// 	log.Println("OptionContentGet result:\n", string(jsonBytes))
	// }

	c.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   result,
	})
}

func OptionItemSortIndexUpdate(c *gin.Context) {
	session := sessions.Default(c)
	username := session.Get("user")

	// ユーザー取得
	var user models.User
	if err := models.DB.Where("username = ?", username.(string)).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var updates []models.OptionItem
	if err := c.ShouldBindJSON(&updates); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tx := models.DB.Begin()

	for _, item := range updates {
		if err := tx.Model(&models.OptionItem{}).
			Where("option_item_id = ?", item.OptionItemID).
			Update("option_item_sort_index", item.OptionItemSortIndex).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "OptionItem sort indices updated successfully",
	})
}
