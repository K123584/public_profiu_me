package models

type AuthUser struct {
	// gorm.Model
	ID       int    `gorm:"primary_key;auto_increment" json:"id"`
	Username string `json:"username"`
	Mail     string `json:"mail"`
	Password string `json:"password"`
}

func (lu *AuthUser) TableName() string {
	return "users"
}
