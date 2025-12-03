package main

import (
	"os"
	"time"

	"github.com/K123584/webmoire/controllers"
	"github.com/K123584/webmoire/middlewares"
	"github.com/K123584/webmoire/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

type UserPage struct {
	gorm.Model
	ID       int    `gorm:"primary_key;auto_increment" json:"id"`
	Username string `gorm:"size:255;not null;unique" json:"username"`
}

func (u *UserPage) TableName() string {
	return "users"
}

func main() {

	time.Sleep(2 * time.Second)
	//

	models.ConnectDataBase()
	models.SqlxConnectDataBase()
	router := gin.Default()

	//cors
	router.Use(cors.New(cors.Config{

		AllowOrigins: []string{
			"http://localhost:3000",
			"http://api.profiu.me",
			"https://api.profiu.me",
			// "http://webmoire.com",  // 旧公開ドメイン
			// "https://webmoire.com", // SSL対応版
			"http://profiu.me",  // 公開ドメイン
			"https://profiu.me", // SSL対応版
		},

		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-CSRF-Token"},
		ExposeHeaders:    []string{"Content-Length", "X-CSRF-Token"},
		AllowCredentials: true,
	}))

	secret := os.Getenv("SESSION_SECRET")
	if secret == "" {
		panic("session_secret error")
	}
	store := cookie.NewStore([]byte(secret))

	// store := cookie.NewStore([]byte("secret"))
	store.Options(sessions.Options{
		MaxAge:   int(60 * 60 * 24 * 30), // 30日(1ヶ月)
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // 本番環境ではtrueにすることを検討
	})

	router.Use(sessions.Sessions("mysession", store))

	public := router.Group("/api")

	csrfSecret := os.Getenv("CSRF_SECRET")
	if csrfSecret == "" {
		panic("CSRF_SECRET error")
	}

	public.GET("/auth", func(c *gin.Context) {
		session := sessions.Default(c)
		user := session.Get("user")

		if user != nil {
			c.JSON(200, gin.H{"loggedIn": true, "username": user})
		} else {
			c.JSON(401, gin.H{"loggedIn": false, "error": "unauthorized"})
		}
	})

	public.POST("/login", controllers.Login)

	public.POST("/signup", controllers.Signup)

	public.Use(middlewares.CsrfMiddleware("csrfSecret"))

	// CSRFトークン発行API
	public.GET("/csrf", middlewares.GetCsrfToken)

	//HealthCheckController
	public.GET("/healthcheck", controllers.HealthCheckController)

	//Logout
	public.POST("/user/:username/edit/logout", controllers.Logout)
	//DeleteAccount
	public.DELETE("/user/:username/edit/deleteaccount", controllers.DeleteAccount)

	//Header
	public.PUT("/user/:username/edit/headerpost", controllers.HeaderPost)
	public.GET("/user/:username/edit/headerget", controllers.HeaderGet)

	//BackGroundUpdate
	public.PUT("/user/:username/edit/backgroundupdate", controllers.BackgroundUpdate)

	//BackgroundGet
	public.GET("/user/:username/edit/backgroundget", controllers.BackgroundGet)

	//NewListPost
	public.POST("/user/:username/edit/newslistpost", controllers.NewListIns)

	//NewsListGet
	public.GET("/user/:username/edit/newslistget", controllers.NewsListGet)
	//NewsListDeatilGet
	public.GET("/user/:username/edit/newslistdetailget/:id", controllers.NewsListDeatilGet)
	//NewsListUpdate
	public.PUT("user/:username/edit/newslistupdate/:id", controllers.NewsListUpdate)

	//NewsListDelete
	public.DELETE("user/:username/edit/newslistdelete/:id", controllers.NewsListDelete)

	public.GET("/user/:username", controllers.UserPageView)

	public.POST("/user/:username/edit/optioncontentpost", controllers.OptionContentIns)
	//OptionContentUpdate
	public.PUT("/user/:username/edit/optioncontentupdate", controllers.OptionContentUpdate)
	//OptionContentPost
	public.GET("/user/:username/edit/optioncontentget", controllers.OptionContentGet)
	//OptionContentDelete
	public.DELETE("/user/:username/edit/optionitemdelete", controllers.OptionItemDelete)

	//OptionItemSortIndexUpdate
	public.PUT("/user/:username/edit/optionitemsortindexupdate", controllers.OptionItemSortIndexUpdate)

	// ------- Open API Routes(公開api) -------

	open := router.Group("/api/open")
	// OpenNewsListGet
	open.GET("/user/:username/opennewsget", controllers.OpenNewsListGet)
	// OpenNewsListDeatilGet
	open.GET("/user/:username/opennewsdetailget/:id", controllers.OpenNewsListDeatilGet)

	// OpenHeaderGet
	open.GET("/user/:username/openheaderget", controllers.OpenHeaderGet)

	// OpenBackgroundGet
	open.GET("/user/:username/openbackgroundget", controllers.OpenBackgroundGet)

	//OpenOptionContentGet
	open.GET("/user/:username/openoptioncontentget", controllers.OpenOptionContentGet)

	// router.Run()
	router.Run("0.0.0.0:8080")
}
