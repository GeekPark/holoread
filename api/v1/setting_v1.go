package v1

import (
	"../../config"
	"../../services"
	"github.com/gin-gonic/gin"
	"github.com/muesli/cache2go"
	// "gopkg.in/mgo.v2/bson"
)

type FeedBackParams struct {
	Content string `json:"content" binding:"required"`
	Email   string `json:"email" binding:"required"`
}

var pool = cache2go.Cache("feedback")

func FeedBack(c *gin.Context) {
	conf := c.MustGet("config").(*config.Config)
	ip := c.Request.Header.Get("X-real-ip")
	ua := c.Request.UserAgent()

	var params FeedBackParams
	if c.BindJSON(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	if pool.Exists(ip + ua) {
		c.JSON(200, gin.H{"msg": "success, repeat"})
		return
	}

	content := "<p>" + params.Content + "<p>" + ip + "</p><p>" + ua + "</p><p>" + params.Email + "</p></p>"
	pool.Add(ip+ua, 0, content)
	go services.SendEmail(conf.Email.Receiver, "[ HOLOREAD 意见反馈 ]", content, "html")
	c.JSON(200, gin.H{"msg": "success"})
}
