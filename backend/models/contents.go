package models

import (
	"time"
)

type Content struct {
	ContentID   int `gorm:"primary_key;auto_increment" json:"content_id"`
	ContentSortIndex int   `gorm:"not null" json:"content_sort_index"`
	AreaID int  `gorm:"not null;index" json:"area_id"`
	UserID int  `gorm:"not null;index" json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type NewsListOutline struct {
	NewsListOutlineID int	`gorm:"primary_key;auto_increment" json:"news_list_outline_id"`
	NewsListOutlineType string `gorm:"not null" json:"news_list_outline_type"`
	ContentID int `gorm:"not null;index" json:"content_id"`
	CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}