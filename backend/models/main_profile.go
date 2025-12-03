package models

type MainProfile struct {
	MainProfileID    int    `gorm:"primary_key;auto_increment" json:"id"`
	MainProfileTitle string `gorm:"type:text;" json:"main_profile_title"`
	MainProfileText  string `gorm:"type:text;" json:"main_profile_text"`
	UserID       int
}

func (m *MainProfile) TableName() string {
	return "main_profile"
}
