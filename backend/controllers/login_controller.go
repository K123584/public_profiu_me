package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/K123584/webmoire/models"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	var login_user models.AuthUser
	var db_user models.AuthUser

	if err := c.ShouldBindJSON(&login_user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Goの構造体login_user(つまり type LoginUser...)のUsernameフィールドを参照
	if err := models.DB.Unscoped().Raw("SELECT * FROM users WHERE username = ?", login_user.Username).First(&db_user).Error; err != nil {

		c.JSON(401, gin.H{"message": "User Not Found"})
		fmt.Print("User Not Found!")
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(db_user.Password), []byte(login_user.Password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		c.JSON(401, gin.H{"message": "Incorrect password"})
		fmt.Println("Incorrect password")
		return

	} else if err != nil {
		c.JSON(500, gin.H{"message": "Internal Server Error"})
		fmt.Println("Error comparing password hash: ", err)
		return
	}

	session := sessions.Default(c)
	session.Set("user", db_user.Username)
	session.Save()

	c.JSON(http.StatusOK, gin.H{"message": "logged in", "status": "ok", "username": db_user.Username, "redirectURL": "/edit"})
	// c.JSON(http.StatusOK, gin.H{"message": "logged in", "status": "ok", "username": db_user.Username, "redirectURL": fmt.Sprintf("/edit/%s", db_user.Username)})
	// c.JSON(http.StatusOK, gin.H{"message": "logged in", "status": "ok", "redirectURL": "/edit/:username"})
	log.Println(http.StatusOK)
}
