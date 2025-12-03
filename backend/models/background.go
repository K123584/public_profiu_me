package models

type UserBg struct {
	//gorm.Model
	ID int `gorm:"primary_key;auto_increment" json:"id"`
}

type Background struct {
	BackgroundID        int    `gorm:"primary_key;auto_increment" json:"background_id"`
	BackgroundType      string `gorm:"type:text;" json:"background_type"`
	BackgroundImagePath string `gorm:"type:text;" json:"background_image_path"`
	BackgroundTextColor string `gorm:"type:text;" json:"background_text_color"`
	BackgroundColor     string `gorm:"type:text;" json:"background_color"`
	BackgroundFont      string `gorm:"type:text;" json:"background_font"`
	BackgroundTextSize  string `gorm:"type:text;" json:"background_text_size"`
	ID                  int    `json:"id"`
}

func (bg *Background) TableName() string {
	return "background"
}
