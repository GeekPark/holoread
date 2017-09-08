package admin

import (
	models "../../models"
	"github.com/gin-gonic/gin"
	// "log"
	// "time"
)

type Access struct {
	Base
}

type AccessMethods interface {
	BaseMethods
}

func InitAccess(m interface{}, name string) *Access {
	a := new(Access)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *Access) Index(c *gin.Context) {
	db := c.MustGet("db")
	var params models.AccessQuery
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	result, _ := api.Model.FindAccesses(db, params)
	count, _ := api.Model.AccessesCount(db, params)
	c.JSON(200, gin.H{"total": count, "data": result})
}
