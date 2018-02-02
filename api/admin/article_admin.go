package admin

import (
	models "../../models"
	"bytes"
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"log"
	"net/http"
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

func (api *Article) UpdateList(c *gin.Context) {
	var params models.ArticleUpdateList
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	err := api.Model.UpdateList(c.MustGet("db"),
		params.List,
		gin.H{"state": params.State})

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

func (api *Article) Translate(c *gin.Context) {
	const requestUrl = "http://127.0.0.1:4008/translate"
	_url, _ := c.GetPostForm("url")
	result, _ := httpPostForm(requestUrl, gin.H{"url": _url})
	err := api.Model.UpdateOneBy(c.MustGet("db"), gin.H{"url": _url}, gin.H{
		"trans_content":  result["content"],
		"edited_content": result["content"],
		"trans_title":    result["title"],
		"edited_title":   result["title"],
	})
	if err != nil {
		log.Println(err)
	}
	c.JSON(200, "ok")
}

func (api *Article) URLContent(c *gin.Context) {
	const requestUrl = "http://127.0.0.1:4008/urlcontent"
	url, _ := c.GetPostForm("url")
	exist, err := api.Model.FindOne(c.MustGet("db"), gin.H{"url": url})
	if err != nil {
		panic(err)
	}
	if exist["edited_content"] == nil || exist["edited_content"] == "" {
		result, _ := httpPostForm(requestUrl, gin.H{"url": url})
		api.Model.UpdateOneBy(c.MustGet("db"), gin.H{"url": url}, gin.H{"edited_content": result["content"]})
		c.JSON(200, result["content"])
	} else {
		c.JSON(200, exist["edited_content"])
	}
}

func httpPostForm(requestUrl string, data interface{}) (map[string]interface{}, error) {
	//json序列化
	b, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return nil, err
	}
	response, err := http.Post(requestUrl, "application/json", bytes.NewBuffer(b))
	if err == nil && (response.StatusCode < 200 || response.StatusCode > 299) {
		err = errors.New(response.Status)
	}
	bytes, _ := ioutil.ReadAll(response.Body)
	result, err := getStations(bytes)
	return result, err
}

func getStations(body []byte) (map[string]interface{}, error) {
	var s map[string]interface{}
	err := json.Unmarshal(body, &s)
	if err != nil {
		log.Println("whoops:", err)
	}
	return s, err
}
