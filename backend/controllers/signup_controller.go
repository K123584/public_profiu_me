package controllers

import (
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/datatypes"
)

// type SignUpUser struct {
// 	// gorm.Model
// 	UserID   int    `gorm:"primary_key;auto_increment" json:"id"`
// 	Username string `json:"username"`
// 	Mail     string `json:"mail"`
// 	Password string `json:"password"`
// }

// func (su *SignUpUser) TableName() string {
// 	return "users"
// }

func Signup(c *gin.Context) {
	var signup_user models.AuthUser
	if err := c.ShouldBindJSON(&signup_user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ユーザー名重複チェック
	var user_count int64
	if err := models.DB.Model(&models.AuthUser{}).Where("username = ?", signup_user.Username).Count(&user_count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	if user_count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "このユーザー名は既に使われています"})
		return
	}
	// メール重複チェック
	var mail_count int64
	if err := models.DB.Model(&models.AuthUser{}).Where("mail = ?", signup_user.Mail).Count(&mail_count).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
		return
	}
	if mail_count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "このメールアドレスは既に使われています"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(signup_user.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error hash passwpord"})
		return
	}

	signup_user.Password = string(hashedPassword)

	//元のsql
	// if err := models.DB.Exec("INSERT INTO users (id, username, mail, password) VALUES (?, ?, ?, ?)", signup_user.UserID, signup_user.Username, signup_user.Mail, signup_user.Password).Error; err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }
	//-----------
	if err := models.DB.Create(&signup_user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//---- ユーザー登録時にmain_profileとheader,background カラムを作成 ----

	header := models.Header{
		HeaderID:              0,
		HeaderText:            "",
		HeaderTextColor:       "",
		HeaderContent:         datatypes.JSON([]byte(`[{"type":"paragraph","children":[{"text":""}]}]`)),
		HeaderType:            "",
		HeaderBackgroundColor: "#e6e6fa",
		HeaderIcon:            "",
		ID:                    signup_user.ID,
	}
	if err := models.DB.Create(&header).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	bg := models.Background{
		BackgroundID:        0,
		BackgroundType:      "color",
		BackgroundImagePath: "01_wave.jpg",
		BackgroundTextColor: "",
		BackgroundColor:     "#f0f8ff",
		BackgroundFont:      "",
		BackgroundTextSize:  "",
		ID:                  signup_user.ID,
	}

	if err := models.DB.Create(&bg).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// var bg models.Background

	// if err := models.DB.Exec("INSERT INTO background (background_id, background_type, background_text_color, background_color, background_font, background_text_size, id) VALUES(?, ?, ?, ?, ?, ?, ?)", bg.BackgroundID, bg.BackgroundType, bg.BackgroundTextColor, bg.BackgroundColor, bg.BackgroundFont, bg.BackgroundTextSize, signup_user.UserID).Error; err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }

	//  ------------------- ここまで　-------------------

	session := sessions.Default(c)
	session.Set("user", signup_user.Username)
	session.Save()

	c.JSON(http.StatusOK, gin.H{"message": "logged in", "status": "ok", "username": signup_user.Username, "redirectURL": "/edit"})
}
