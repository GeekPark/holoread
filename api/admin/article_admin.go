package admin

import (
	models "../../models"
	// "fmt"
	"gopkg.in/gin-gonic/gin.v1"
)

type Article struct {
	Base
}

type ArticleMethods interface {
	BaseMethods
}

func InitArticle(m interface{}, name string) *Article {
	a := new(Article)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *Article) Index(c *gin.Context) {
	db := c.MustGet("db")
	query := make(map[string]interface{})
	var params models.ArticleQuery
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}

	result, _ := api.Model.FindArticles(db, params)
	count, _ := api.Model.Count(db, query)
	c.JSON(200, gin.H{"total": count, "data": result})
}

func (api *Article) Show(c *gin.Context) {
	id := c.Param("id")
	result, err := api.Model.FindById(c.MustGet("db"), id)
	if err != nil {
		panic(err)
	}
	c.JSON(200, result)
}
