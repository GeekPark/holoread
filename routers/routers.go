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
	user := &admin.Base{&models.Base{&models.User{}, "users"}, "users"}
	restful(r, user, "users")
}

func restful(r *gin.Engine, handle *admin.Base, path string) {

	var fullPath = "/" + path
	var idPath = "/" + path + "/:id"

	r.GET(fullPath, handle.Index)
	r.GET(idPath, handle.Show)
	r.POST(fullPath, handle.Create)
	r.PUT(idPath, handle.Update)
	r.DELETE(idPath, handle.Delete)
}
