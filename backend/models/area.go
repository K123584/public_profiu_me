package models

import "time"

type Area struct {
	AreaID   int    `gorm:"primary_key;auto_increment" json:"area_id"`
	AreaSortIndex int   `gorm:"not null" json:"area_sort_index"`
	BackgroundImage string `json:"background_image"`
	BackgroundColor string `json:"background_color"`
	UserID int  `gorm:"not null" json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}