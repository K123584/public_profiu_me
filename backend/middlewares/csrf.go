package middlewares

import (
	"github.com/gin-gonic/gin"
	csrf "github.com/utrack/gin-csrf"
)

func CsrfMiddleware(secret string) gin.HandlerFunc {
	return csrf.Middleware(csrf.Options{
		Secret: secret,
	})
}

// トークン発行用ハンドラ
func GetCsrfToken(c *gin.Context) {
	c.JSON(200, gin.H{
		"csrf_token": csrf.GetToken(c),
	})
}
