package v1

import (
	"../../config"
	"../../services"
	"github.com/gin-gonic/gin"
	// "gopkg.in/mgo.v2/bson"
)

type FeedBackParams struct {
	Content string `json:"content" binding:"required"`
	Email   string `json:"email" binding:"required"`
}

func FeedBack(c *gin.Context) {
	conf := c.MustGet("config").(*config.Config)
	var params FeedBackParams
	if c.BindJSON(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}

	_ = services.SendEmail(conf.Email.Receiver, "[ HOLOREAD 意见反馈 ]", params.Content, "html")
	c.JSON(200, gin.H{"msg": "success"})
}
