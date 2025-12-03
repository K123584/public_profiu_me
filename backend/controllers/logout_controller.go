package controllers

import (
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

func Logout(ctx *gin.Context) {
	session := sessions.Default(ctx)
	session.Clear()
	session.Options(sessions.Options{Path: "/", MaxAge: -1})
	if err := session.Save(); err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to save session"})
		return
	}
	ctx.JSON(200, gin.H{"message": "Logged out successe"})
}
