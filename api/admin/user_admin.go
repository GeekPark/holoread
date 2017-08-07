package admin

import (
	models "../../models"
	"gopkg.in/gin-gonic/gin.v1"
)

type User struct {
	Base
}

type UserMethods interface {
	BaseMethods
}

func InitUser(m interface{}, name string) *User {
	a := new(User)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *User) Index(c *gin.Context) {
	db := c.MustGet("db")
	query := make(map[string]interface{})
	var params models.UserQuery
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	result, _ := api.Model.FindUsers(db, params)
	count, _ := api.Model.Count(db, query)
	c.JSON(200, gin.H{"total": count, "data": result})
}

func (api *User) Show(c *gin.Context) {
	id := c.Param("id")
	result, err := api.Model.FindById(c.MustGet("db"), id)
	if err != nil {
		panic(err)
	}
	c.JSON(200, result)
}

func (api *User) Update(c *gin.Context) {
	id := c.Param("id")
	var params models.UserUpdate
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	err := api.Model.UpdateUser(c.MustGet("db"), id, params)
	if err != nil {
		panic(err)
		return
	}
	c.JSON(200, gin.H{"msg": "success"})
}
