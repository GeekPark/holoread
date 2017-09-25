package v1

import (
	models "../../models"
	// "fmt"
	// "github.com/fatih/structs"
	"bytes"
	"encoding/base64"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"
)

const FORMAT = "2006-01-02 15:04:05"
const url = "http://127.0.0.1:4004"

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

func (api *Article) Test(c *gin.Context) {
	start, _ := strconv.Atoi(c.DefaultQuery("start", "0"))
	count, _ := strconv.Atoi(c.DefaultQuery("count", "20"))
	coll := c.MustGet("db").(*mgo.Database).C(api.Name)
	match := gin.H{"is_cn": false}
	if c.Query("source") != "" {
		match["source"] = c.Query("source")
	}

	pipe := []gin.H{
		gin.H{"$match": match},
		gin.H{"$project": gin.H{
			// "origin_content": 0,
			"trans_content":  0,
			"trans_title":    0,
			"edited_title":   0,
			"edited_content": 0,
			"tags":           0,
			"summary":        0,
		}},
		gin.H{"$sort": gin.H{"published": -1}},
		gin.H{"$skip": count * start},
		gin.H{"$limit": count},
	}

	resp := []interface{}{}
	_ = coll.Pipe(pipe).All(&resp)
	resp = Map(resp, func(v interface{}) interface{} {
		m := v.(bson.M)
		m["origin_content"] = httpPostForm(m["origin_content"].(string))
		return m
	})
	c.JSON(200, gin.H{"data": resp})
}

func httpPostForm(text string) string {

	// log.Println("URL:>", url)

	//json序列化
	post := string(base64.StdEncoding.EncodeToString([]byte(text)))

	// log.Println(url, "post", post)

	var jsonStr = []byte(post)
	// log.Println("jsonStr", jsonStr)
	// log.Println("new_str", bytes.NewBuffer(jsonStr))

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	// req.Header.Set("X-Custom-Header", "myvalue")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// log.Println("response Status:", resp.Status)
	// log.Println("response Headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	// log.Println("response Body:", string(body))
	return string(body)
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
		match["updatedAt"] = gin.H{"$gt": yesterday()}
	} else {
		lastInt, _ := strconv.ParseInt(last, 10, 0)
		lastUnix := time.Unix(lastInt, 0)

		match["updatedAt"] = gin.H{"$gt": lastUnix}
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
			"localField":   "_id",
			"foreignField": "article",
			"as":           "likes",
		}},
	}

	resp := []interface{}{}
	_ = coll.Pipe(pipe).All(&resp)
	resp = Map(resp, func(v interface{}) interface{} {
		return likeAndHot(v, userid)
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
		match["createdat"] = gin.H{"$lt": time.Unix(lastInt, 0)}
	}

	pipe := []gin.H{
		gin.H{"$match": match},
		gin.H{"$sort": gin.H{"createdat": -1}},
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
		newHot["createdAt"] = hot["createdat"].(time.Time).Unix()
		newHot["updatedAt"] = newHot["updatedAt"].(time.Time).Unix()
		newHot["hot"] = hot["hot"]
		newHot["like"] = hot["like"]
		return newHot
	})
	c.JSON(200, gin.H{"data": resp})
}

func (api *Article) Show(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)
	id := c.Param("id")
	userid := c.DefaultQuery("userid", "")
	ip := c.Request.Header.Get("X-real-ip")
	log.Println(ip)
	accessQuery := bson.M{"ip": ip, "article": bson.ObjectIdHex(id)}
	var access bson.M
	err := db.C("accesses").Find(accessQuery).One(&access)
	if err != nil {
		accessQuery["createdAt"] = time.Now()
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
			"localField":   "_id",
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
	m["hot"] = (len(m["likes"].([]interface{}))*10 + len(m["accesses"].([]interface{}))) > 20

	if m["updatedAt"] != nil {
		m["updatedAt"] = m["updatedAt"].(time.Time).Unix()
	}
	if m["createdAt"] != nil {
		m["createdAt"] = m["createdAt"].(time.Time).Unix()
	}

	if userid == "" {
		m["like"] = false
		m["likes"] = make([]interface{}, 0)
		m["accesses"] = make([]interface{}, 0)
		return list.(bson.M)
	}
	m["like"] = len(m["likes"].([]interface{})) > 0 &&
		Some(m["likes"].([]interface{}), func(el interface{}) bool {
			hex := el.(bson.M)["from"].(bson.ObjectId).Hex()
			return hex == userid
		})
	m["likes"] = make([]interface{}, 0)
	m["accesses"] = make([]interface{}, 0)
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
