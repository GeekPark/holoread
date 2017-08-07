package routers

import (
	// ArticleAdmin "../api/admin/article"
	// LogAdmin "../api/admin/log"
	admin "../api/admin"
	models "../models"
	// "fmt"
	"gopkg.in/gin-gonic/gin.v1"
)

func Init(r *gin.Engine) {
	mountAdmin(r)
}

func mountAdmin(r *gin.Engine) {

	g := r.Group("/api/admin")
	// restful(g, admin.InitBase(&models.User{}, "users"), "users")

	articles := admin.InitArticle(&models.Article{}, "articles")
	g.GET("/articles", articles.Index)
	g.GET("/articles/:id", articles.Show)
	g.PUT("/articles/:id", articles.Update)

	users := admin.InitUser(&models.User{}, "users")
	g.GET("/users", users.Index)
	g.GET("/users/:id", users.Show)
	g.PUT("/users/:id", users.Update)
}

// restful api
func restful(r *gin.RouterGroup, handle *admin.Base, path string) {

	var fullPath = "/" + path
	var idPath = "/" + path + "/:id"

	r.GET(fullPath, handle.Index)
	r.GET(idPath, handle.Show)
	r.POST(fullPath, handle.Create)
	r.PUT(idPath, handle.Update)
	r.DELETE(idPath, handle.Delete)
}
