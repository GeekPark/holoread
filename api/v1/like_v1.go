package v1

import (
	models "../../models"
	// "fmt"
	// "github.com/fatih/structs"
	"github.com/gin-gonic/gin"
	// "gopkg.in/mgo.v2"
	// "gopkg.in/mgo.v2/bson"
	// "strconv"
	"time"
)

type Like struct {
	Base
}

type LikeMethods interface {
	BaseMethods
}

func InitLike(m interface{}, name string) *Like {
	a := new(Like)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *Like) Create(c *gin.Context) {
	db := c.MustGet("db")
	var params models.LikeQuery

	if c.BindJSON(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	exist, err := api.Model.FindOne(db, gin.H{
		"article": params.Article,
		"from":    params.From})
	if err == nil {
		c.JSON(400, gin.H{"msg": "liked", "data": exist})
		return
	}
	params.CreatedAt = time.Now()
	_ = api.Model.CreateLike(db, params)
	c.JSON(200, gin.H{"msg": "success"})
}

func (api *Like) Delete(c *gin.Context) {
	var params models.LikeQuery
	if c.BindJSON(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}

	db := c.MustGet("db")
	err := api.Model.DeleteBy(db, gin.H{"article": params.Article, "from": params.From})

	if err != nil {
		c.JSON(400, gin.H{"msg": "not found"})
		return
	}
	c.JSON(200, gin.H{"msg": "success"})
}
