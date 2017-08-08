package v1

import (
	models "../../models"
	// "fmt"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"strconv"
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
	start, _ := strconv.Atoi(c.DefaultQuery("start", "0"))
	count, _ := strconv.Atoi(c.DefaultQuery("count", "20"))

	coll := c.MustGet("db").(*mgo.Database).C(api.Name)
	match := gin.H{
		"updatedAt": gin.H{"$gte": yesterday()},
		"$nor":      []gin.H{gin.H{"state": "pending"}, gin.H{"state": "deleted"}},
	}
	pipe := []gin.H{
		gin.H{"$match": match},
		gin.H{"$project": gin.H{
			"origin_content": 0,
			"origin_title":   0,
			"trans_content":  0,
			"trans_title":    0,
			"edited_content": 0,
			"url":            0,
			"tags":           0,
		}},
		gin.H{"$sort": gin.H{"updatedAt": 1}},
		gin.H{"$skip": start * count},
		gin.H{"$limit": count},
		gin.H{"$lookup": gin.H{
			"from":         "accesses",
			"localField":   "_id",
			"foreignField": "article",
			"as":           "accesses",
		}},
		gin.H{"$lookup": gin.H{
			"from":         "likes",
			"localField":   "article",
			"foreignField": "article",
			"as":           "likes",
		}},
	}

	resp := []gin.H{}
	_ = coll.Pipe(pipe).All(&resp)
	c.JSON(200, gin.H{"data": resp})
}

func (api *Article) Likes(c *gin.Context) {
	start, _ := strconv.Atoi(c.DefaultQuery("start", "0"))
	count, _ := strconv.Atoi(c.DefaultQuery("count", "20"))

	db := c.MustGet("db").(*mgo.Database)
	likeColl := db.C("likes")
	from := bson.ObjectIdHex(c.Param("userid"))

	match := gin.H{
		// "createdAt": gin.H{"$gte": yesterday()},
		"from": from,
	}

	pipe := []gin.H{
		gin.H{"$match": match},
		gin.H{"$sort": gin.H{"createdAt": -1}},
		gin.H{"$skip": start * count},
		gin.H{"$limit": count},
		gin.H{"$lookup": gin.H{
			"from":         "articles",
			"localField":   "article",
			"foreignField": "_id",
			"as":           "article",
		}},
		gin.H{"$unwind": "$article"},
		gin.H{"$project": gin.H{
			"article.origin_content": 0,
			"article.origin_title":   0,
			"article.trans_content":  0,
			"article.trans_title":    0,
			"article.edited_content": 0,
			"article.url":            0,
			"article.tags":           0,
		}},

		gin.H{"$lookup": gin.H{
			"from":         "likes",
			"localField":   "article",
			"foreignField": "article",
			"as":           "likes",
		}},
	}

	resp := []gin.H{}
	_ = likeColl.Pipe(pipe).All(&resp)
	c.JSON(200, gin.H{"data": resp})
}

func (api *Article) Show(c *gin.Context) {
	id := c.Param("id")
	result, err := api.Model.FindById(c.MustGet("db"), id)
	if err != nil {
		panic(err)
	}
	c.JSON(200, result)
}

func yesterday() time.Time {
	nTime := time.Now()
	yesTime := nTime.AddDate(0, 0, -1)
	// logDay := yesTime.Format("20060102")
	return yesTime
}
