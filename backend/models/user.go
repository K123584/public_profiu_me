package models

type User struct {
	// gorm.Model
	ID   int    `gorm:"primary_key;auto_increment" json:"id"`
	Username string `json:"username"`
	Mail     string `json:"mail"`
}

func (u *User) TableName() string {
	return "users"
}


type PublicUser struct {
	// gorm.Model
	UserID   int    `gorm:"primary_key;auto_increment" json:"id"`
	Username string `json:"username"`
}

func (u *PublicUser) TableName() string {
	return "users"
}