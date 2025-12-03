package models

import "gorm.io/datatypes"

type UserHeader struct {
	//gorm.Model
	ID     int      `gorm:"primary_key;auto_increment" json:"id"`
	Header []Header `gorm:"foreignKey:UserHeaderID"`
}

type Header struct {
	//gorm.Model
	HeaderID              int            `gorm:"primary_key;auto_increment" json:"header_id"`
	HeaderText            string         `gorm:"type:text;" json:"header_text"`
	HeaderContent         datatypes.JSON `json:"header_content"`
	HeaderTextColor       string         `gorm:"type:text;" json:"header_text_color"`
	HeaderType            string         `gorm:"type:text;" json:"header_type"`
	HeaderBackgroundColor string         `gorm:"type:text;" json:"header_background_color"`
	HeaderIcon            string         `gorm:"type:text;" json:"header_icon"`
	ID                    int            `json:"id"`
}

func (h *Header) TableName() string {
	return "header"
}
