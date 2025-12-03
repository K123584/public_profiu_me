package models

import (
	"time"

	"gorm.io/datatypes"
)

type OptionItem struct {
	OptionItemID        int       `gorm:"primary_key;auto_increment" json:"option_item_id"`
	OptionItemSortIndex int       `gorm:"not null" json:"option_item_sort_index"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
	UserID              int
	// UserID int `gorm:"not null;index" json:"user_id"`
}

func (oi *OptionItem) TableName() string {
	return "option_items"
}

type OptionContent struct {
	OptionContentID int            `gorm:"primary_key;auto_increment" json:"option_content_id"`
	OptionContent   datatypes.JSON `json:"option_content"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	OptionItemID    int            `gorm:"not null;index" json:"option_item_id"`
}

func (oc *OptionContent) TableName() string {
	return "option_contents"
}

type OptionContentInput struct {
	OptionItemContent datatypes.JSON `json:"option_item_content"`
}

type OptionContentUpdate struct {
	OptionItemID      int            `json:"option_item_id"`
	OptionItemContent datatypes.JSON `json:"option_item_content"`
}

// type OptionContentUpdate struct {
// 	OptionItemID      int    `json:"option_item_id"`
// 	OptionItemContent string `json:"option_item_content"`
// }

type OptionContentDelete struct {
	OptionItemID    int `json:"option_item_id"`
	OptionContentID int `json:"option_content_id"`
}

type OptionItemWithContent struct {
	OptionItemID        int            `json:"option_item_id"`
	OptionItemSortIndex int            `json:"option_item_sort_index"`
	OptionContentID     int            `json:"option_content_id"`
	OptionContent       datatypes.JSON `json:"option_content"`
	//option_content側の日時を採用
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
