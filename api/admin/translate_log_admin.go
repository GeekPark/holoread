package admin

import (
	models "../../models"
	database "../../services/db"
	"github.com/gin-gonic/gin"
	"github.com/muesli/cache2go"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

var checkArticlesPool = cache2go.Cache("checkArticles")

type TranslateLog struct {
	Base
}

type TranslateLogMethods interface {
	BaseMethods
}

type originArticle struct {
	Id    bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Url   string        `json:"url" bson:"url"`
	Type  string        `json:"type" bson:"type"`
	Title string        `json:"title" bson:"title"`
	Date  time.Time     `json: "date" bson:"date"`
}

func InitTranslateLog(m interface{}, name string) *TranslateLog {
	a := new(TranslateLog)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *TranslateLog) Index(c *gin.Context) {
	db := c.MustGet("logdb")
	var params models.TranslateLogQuery
	if c.Bind(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	result, _ := api.Model.FindTranslateLogs(db, params)
	count, _ := api.Model.TranslateLogsCount(db, params)
	c.JSON(200, gin.H{"total": count, "data": result})
}

// 检查漏翻译
func (api *TranslateLog) Check(c *gin.Context) {
	item, err := checkArticlesPool.Value("ignoreArticles")
	var ignoreArticles []originArticle
	if err == nil {
		log.Println("load cache check")
		ignoreArticles = item.Data().([]originArticle)
	} else {
		ignoreArticles = checkArticles(c)
		checkArticlesPool.Add("ignoreArticles", 60*time.Minute, ignoreArticles)
	}
	c.JSON(200, gin.H{"total": 500, "data": ignoreArticles})
}

func checkArticles(c *gin.Context) []originArticle {
	articledb := c.MustGet("articledb")
	ds := database.NewSessionStore()
	defer ds.Close()
	articlecoll := articledb.(*mgo.Database).C("articles")
	coll := ds.C("articles")

	var originArticles []originArticle
	var ignoreArticles []originArticle
	_ = articlecoll.Find(bson.M{
		"date": bson.M{"$gte": addTime(48)},
	}).Sort("-date").Limit(500).All(&originArticles)

	for i := 0; i < len(originArticles); i++ {
		item := originArticles[i]
		var exist originArticle
		_ = coll.Find(bson.M{"url": item.Url}).Select(bson.M{"url": 1, "date": 1}).One(&exist)
		if exist.Url == "" {
			ignoreArticles = append(ignoreArticles, item)
		}
	}
	return ignoreArticles
}

func addTime(num time.Duration) time.Time {
	now := time.Now()
	h, _ := time.ParseDuration("-1h")
	h1 := now.Add(num * h)
	// log.Println(h1)
	return h1
}
