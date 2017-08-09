package v1

import (
	models "../../models"
	// "fmt"
	// "github.com/fatih/structs"
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
	count, _ := strconv.Atoi(c.DefaultQuery("count", "20"))

	userid := c.DefaultQuery("userid", "")
	last := c.DefaultQuery("last", "")
	coll := c.MustGet("db").(*mgo.Database).C(api.Name)
	match := gin.H{
		"$nor": []gin.H{gin.H{"state": "pending"}, gin.H{"state": "deleted"}},
	}
	if last == "" {
		match["updatedAt"] = gin.H{"$gte": yesterday()}
	} else {
		lastInt, _ := strconv.ParseInt(last, 10, 0)
		match["updatedAt"] = gin.H{"$gte": time.Unix(lastInt, 0)}
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

	resp := []interface{}{}
	_ = coll.Pipe(pipe).All(&resp)
	resp = Map(resp, func(v interface{}) interface{} {
		hot := likeAndHot(v, userid)
		return hot
	})
	c.JSON(200, gin.H{"data": resp})
}

func (api *Article) Likes(c *gin.Context) {
	count, _ := strconv.Atoi(c.DefaultQuery("count", "20"))
	last := c.DefaultQuery("last", "")

	db := c.MustGet("db").(*mgo.Database)
	likeColl := db.C("likes")
	userid := c.Param("userid")
	from := bson.ObjectIdHex(userid)

	match := gin.H{"from": from}
	if last != "" {
		lastInt, _ := strconv.ParseInt(last, 10, 0)
		match["createdAt"] = gin.H{"$gte": time.Unix(lastInt, 0)}
	}

	pipe := []gin.H{
		gin.H{"$match": match},
		gin.H{"$sort": gin.H{"createdAt": -1}},
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
			"localField":   "article._id",
			"foreignField": "article",
			"as":           "likes",
		}},
		gin.H{"$lookup": gin.H{
			"from":         "accesses",
			"localField":   "article._id",
			"foreignField": "article",
			"as":           "accesses",
		}},
	}

	resp := []interface{}{}
	_ = likeColl.Pipe(pipe).All(&resp)
	resp = Map(resp, func(v interface{}) interface{} {
		hot := likeAndHot(v, userid)
		var newHot = hot["article"].(bson.M) // 兼容客户端
		for k, v := range hot {
			if k == "hot" {
				newHot["hot"] = v
			} else if k == "like" {
				newHot["like"] = v
			} else if k == "_id" {
				newHot["likeid"] = v
			}
		}
		return newHot
	})
	c.JSON(200, gin.H{"data": resp})
}

func (api *Article) Show(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)
	id := c.Param("id")
	userid := c.DefaultQuery("userid", "")
	ip := c.ClientIP()
	accessQuery := bson.M{"ip": ip, "article": bson.ObjectIdHex(id)}
	var access bson.M
	err := db.C("accesses").Find(access).One(&access)
	if err != nil {
		_ = db.C("accesses").Insert(accessQuery)
	}

	pipe := []gin.H{
		gin.H{"$match": gin.H{"_id": bson.ObjectIdHex(id)}},
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
	var result bson.M
	_ = db.C(api.Name).Pipe(pipe).One(&result)
	result = likeAndHot(result, userid)
	c.JSON(200, result)
}

func yesterday() time.Time {
	nTime := time.Now()
	yesTime := nTime.AddDate(0, 0, -1)
	// logDay := yesTime.Format("20060102")
	return yesTime
}

func likeAndHot(list interface{}, userid string) bson.M {
	m := list.(bson.M)
	for k, v := range m {

		m["hot"] = (len(m["likes"].([]interface{}))*10 + len(m["accesses"].([]interface{}))) > 20

		if userid == "" {
			m["likes"] = make([]interface{}, 0)
			m["accesses"] = make([]interface{}, 0)
			return list.(bson.M)
		}

		switch k {
		case "likes":
			{
				m["like"] = len(v.([]interface{})) > 0 &&
					Some(m["likes"].([]interface{}), func(el interface{}) bool {
						hex := el.(bson.M)["from"].(bson.ObjectId).Hex()
						return hex == userid
					})
				m["likes"] = make([]interface{}, 0)
				m["accesses"] = make([]interface{}, 0)
			}
		}
	}
	return m
}

func Some(m []interface{}, f func(v interface{}) bool) bool {
	for i := 0; i < len(m); i++ {
		if f(m[i]) == true {
			return true
		}
	}
	return false
}

func Map(m []interface{}, f func(v interface{}) interface{}) []interface{} {
	result := make([]interface{}, len(m))
	for i := 0; i < len(m); i++ {
		result[i] = f(m[i])
	}
	return result
}
