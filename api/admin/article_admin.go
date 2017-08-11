package admin

import (
	models "../../models"
	"github.com/gin-gonic/gin"
	// "log"
	"time"
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
	var params models.ArticleQuery
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	result, _ := api.Model.FindArticles(db, params)
	count, _ := api.Model.ArticlesCount(db, params)
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

func (api *Article) Update(c *gin.Context) {
	id := c.Param("id")
	var params models.ArticleUpdate
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	update := updateParams(params)
	err := api.Model.Update(c.MustGet("db"), id, update)
	if err != nil {
		panic(err)
		return
	}
	c.JSON(200, gin.H{"msg": "success"})
}

// 为什么写这么复杂, 因为这个框架对json数据中key包含下划线的情况会做忽略, 干
func updateParams(params models.ArticleUpdate) map[string]interface{} {
	update := make(map[string]interface{})
	if params.EditedTitle != "" && len(params.EditedTitle) > 0 {
		update["edited_content"] = params.EditedContent
		update["edited_title"] = params.EditedTitle
		update["url"] = params.Url
		update["source"] = params.Source
		update["summary"] = params.Summary
	}
	update["state"] = params.State
	update["updatedAt"] = time.Now()
	return update
}
