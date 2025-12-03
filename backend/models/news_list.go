package models

import (
	"gorm.io/datatypes"
)

type NewsList struct {
	// gorm.Model
	News_id        int            `gorm:"primary_key;auto_increment" json:"news_id"`
	ArticleTitle   datatypes.JSON `json:"article_title"`
	ArticleContent datatypes.JSON `json:"article_content"`
	UserID         int
}

func (nl *NewsList) TableName() string {
	return "news_list"
}
