package v1

import (
	models "../../models"
	"../../services"
	"../../services/encrypt"
	// "fmt"
	"github.com/gin-gonic/gin"
	// "gopkg.in/mgo.v2/bson"
	"time"
)

type User struct {
	Base
}

type UserMethods interface {
	BaseMethods
}

func InitUser(m interface{}, name string) *User {
	a := new(User)
	a.Name = name
	a.Model = models.InitBase(m, name)
	return a
}

func (api *User) SendSms(c *gin.Context) {
	db := c.MustGet("db")
	var params models.LoginParams
	if c.BindJSON(&params) != nil || params.Phone == "" {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	code := services.SendSms(params.Phone)
	_ = api.Model.UpdateOneBy(db, gin.H{"openid": params.OpenId}, gin.H{"sms.code": code})
	c.JSON(200, gin.H{"data": params.Phone, "msg": "success"})
}

func (api *User) WechatLogin(c *gin.Context) {
	db := c.MustGet("db")
	var params models.LoginParams
	if c.BindJSON(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	result, err := api.Model.FindOne(db, gin.H{"openid": params.OpenId})
	if err != nil {
		token := encrypt.GetRandomString(50)
		params.Token = token
		params.CreatedAt = time.Now()
		err = api.Model.CreateUser(db, params)
		result, err = api.Model.FindOne(db, gin.H{"openid": params.OpenId})
		c.JSON(200, gin.H{"data": result})
		return
	}
	c.JSON(200, result)
}

func (api *User) VerifySms(c *gin.Context) {
	db := c.MustGet("db")
	var params models.LoginParams
	if c.BindJSON(&params) != nil {
		c.JSON(400, gin.H{"msg": "params error"})
		return
	}
	_, err := api.Model.FindOne(db, gin.H{
		"sms.code": params.Code,
		"openid":   params.OpenId})
	if err != nil {
		c.JSON(400, gin.H{"msg": "not match"})
		return
	}
	err = api.Model.UpdateOneBy(db, gin.H{"openid": params.OpenId}, gin.H{"phone": params.Phone})
	c.JSON(200, gin.H{"msg": "success"})
}
