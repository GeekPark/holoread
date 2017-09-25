package routers

import (
	admin "../api/admin"
	v1 "../api/v1"
	models "../models"
	// "fmt"
	"../services"
	"github.com/gin-gonic/gin"
)

func Init(r *gin.Engine) {
	mountAdmin(r)
	mountV1(r)
	mountWs(r)
}

func mountWs(r *gin.Engine) {
	r.Any("/ws", admin.LockConnect)
}

func mountV1(r *gin.Engine) {
	articles := v1.InitArticle(&models.Article{}, "articles")
	users := v1.InitUser(&models.User{}, "users")
	likes := v1.InitLike(&models.Like{}, "likes")

	g := r.Group("/api/v1")

	g.POST("/login/wechat", users.WechatLogin)
	g.POST("sms/verify", users.VerifySms)
	g.POST("/sms/new", users.SendSms)

	g.GET("/articles", articles.Index)
	g.GET("/articles/:id", articles.Show)
	g.GET("/fetures/test", articles.Test)
	g.GET("/likes/articles/:userid", articles.Likes)

	g.POST("/likes", likes.Create)
	g.DELETE("/likes", likes.Delete)

	g.POST("/feedback", v1.FeedBack)
}

func mountAdmin(r *gin.Engine) {

	articles := admin.InitArticle(&models.Article{}, "articles")
	users := admin.InitUser(&models.User{}, "users")
	accesses := admin.InitAccess(&models.Access{}, "accesses")
	translogs := admin.InitTranslateLog(&models.TranslateLog{}, "translatelogs")

	r.POST("/api/login/sendsms", users.SendSms)
	r.POST("/api/login", users.Login)
	r.POST("/api/logout", users.Logout)

	g := r.Group("/api/admin")

	g.Use(services.AuthSession())

	g.GET("/articles", articles.Index)
	g.GET("/articles/:id", articles.Show)
	g.PUT("/articles/:id", articles.Update)
	g.PUT("/articles", articles.UpdateList)

	g.GET("/users", users.Index)
	g.GET("/users/:id", users.Show)
	g.PUT("/users/:id", users.Update)

	g.GET("/accesses", accesses.Index)
	g.GET("/translatelogs", translogs.Index)

}

// restful api
// restful(g, admin.InitBase(&models.User{}, "users"), "users")
func restful(r *gin.RouterGroup, handle *admin.Base, path string) {

	var fullPath = "/" + path
	var idPath = "/" + path + "/:id"

	r.GET(fullPath, handle.Index)
	r.GET(idPath, handle.Show)
	r.POST(fullPath, handle.Create)
	r.PUT(idPath, handle.Update)
	r.DELETE(idPath, handle.Delete)
}
