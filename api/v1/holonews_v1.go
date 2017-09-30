package v1

import (
	// models "../../models"
	// "fmt"
	// "github.com/fatih/structs"
	//
	"bytes"
	"encoding/base64"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"github.com/muesli/cache2go"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var holonewsPool = cache2go.Cache("holonews")

const url = "http://127.0.0.1:4004"

func (api *Article) HoloNewsWords(c *gin.Context) {
	var words interface{}
	item, err := holonewsPool.Value("words")
	if err == nil {
		log.Println("load cache words")
		words = item.Data().([]interface{})
	} else {
		words = httpPostForm("")
		holonewsPool.Add("words", 6*time.Hour, words)
	}
	c.JSON(200, words)
}

func (api *Article) HoloNews(c *gin.Context) {

	var resp interface{}
	key := c.Request.URL.String()
	item, err := holonewsPool.Value(key)
	if err == nil {
		log.Println("load cache news")
		resp = item.Data().([]interface{})
	} else {
		// log.Println("load news")
		start, _ := strconv.Atoi(c.DefaultQuery("start", "0"))
		count, _ := strconv.Atoi(c.DefaultQuery("count", "20"))
		coll := c.MustGet("db").(*mgo.Database).C(api.Name)
		match := bson.M{"is_cn": false}
		if c.Query("source") != "" {
			match["source"] = c.Query("source")
		}
		resp = holoNewsQuery(coll, match, start, count)
		holonewsPool.Add(key, 5*time.Minute, resp)
	}
	c.JSON(200, gin.H{"data": resp})
}

func holoNewsQuery(coll *mgo.Collection, match bson.M, start int, count int) []interface{} {

	pipe := []gin.H{
		gin.H{"$match": match},
		gin.H{"$sort": gin.H{"published": -1}},
		gin.H{"$skip": count * start},
		gin.H{"$limit": count},
		gin.H{"$project": gin.H{
			// "origin_content": 0,
			"trans_content": 0,
			"trans_title":   0,
			// "edited_title":   0,
			"edited_content": 0,
			"tags":           0,
			"summary":        0,
		}},
	}

	resp := []interface{}{}
	_ = coll.Pipe(pipe).All(&resp)
	resp = Map(resp, func(v interface{}) interface{} {
		m := v.(bson.M)
		str := m["origin_content"].(string)
		trimStr := strings.Split(trimHtml(str), "\n")[0]
		if len(strings.Split(trimStr, " ")) > 10 {
			m["origin_content"] = trimStr
		} else {
			m["origin_content"] = ""
		}
		m["cover"] = getImgSrc(str)
		return m
	})
	return resp
}

func trimHtml(src string) string {
	//将HTML标签全转换成小写
	re, _ := regexp.Compile("\\<[\\S\\s]+?\\>")
	src = re.ReplaceAllStringFunc(src, strings.ToLower)
	//去除STYLE
	re, _ = regexp.Compile("\\<style[\\S\\s]+?\\</style\\>")
	src = re.ReplaceAllString(src, "")
	//去除SCRIPT
	re, _ = regexp.Compile("\\<script[\\S\\s]+?\\</script\\>")
	src = re.ReplaceAllString(src, "")
	//去除所有尖括号内的HTML代码，并换成换行符
	re, _ = regexp.Compile("\\<[\\S\\s]+?\\>")
	src = re.ReplaceAllString(src, "\n")
	//去除连续的换行符
	re, _ = regexp.Compile("\\s{2,}")
	src = re.ReplaceAllString(src, "\n")
	return strings.TrimSpace(src)
}

func getImgSrc(str string) string {
	re, _ := regexp.Compile("\\<img[\\S\\s]+?\\>")
	result := re.FindStringSubmatch(str)
	newStr := strings.Join(result, "")
	re = regexp.MustCompile(`(http://|https://)\S+(.jpeg|.jpg|.png)`)
	return re.FindString(newStr)
}

func httpPostForm(text string) []interface{} {
	//json序列化
	post := string(base64.StdEncoding.EncodeToString([]byte(text)))
	var jsonStr = []byte(post)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonStr))
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	// log.Println("response Status:", resp.Status)
	// log.Println("response Headers:", resp.Header)
	bytes, _ := ioutil.ReadAll(resp.Body)
	s, err := getStations([]byte(bytes))
	// log.Println("response Body:", string(body))
	// s := make([]interface{}, len(bytes))
	// for i, v := range bytes {
	//  s[i] = string(v)
	// }
	return s
}

func getStations(body []byte) ([]interface{}, error) {
	var s []interface{}
	err := json.Unmarshal(body, &s)
	if err != nil {
		log.Println("whoops:", err)
	}
	return s, err
}
