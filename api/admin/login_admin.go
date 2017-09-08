package admin

import (
	"../../config"
	// models "../../models"
	"../../services/encrypt"
	"fmt"
	// "github.com/fatih/structs"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2/bson"
	"io/ioutil"
	"net/http"
	"net/url"
)

const url_send_sms = "https://sms.yunpian.com/v2/sms/single_send.json"

func tpl(code string) string {
	return "【极客公园】您的验证码是" + code + "， 有效期为30分钟。请妥善保管您的验证码，勿透露给他人"
}

func (api *User) SendSms(c *gin.Context) {
	db := c.MustGet("db")
	phone := c.PostForm("phone")
	result, err := api.Model.FindOne(db, gin.H{"permission": "admin", "phone": phone})
	if err != nil {
		c.JSON(404, gin.H{"msg": "not found"})
		return
	}

	code := encrypt.GetRandomNumber(6)
	id := result["_id"].(bson.ObjectId)
	data_send_sms := url.Values{"apikey": {config.Yunpian}, "mobile": {phone}, "text": {tpl(code)}}
	httpsPostForm(url_send_sms, data_send_sms)
	err = api.Model.UpdateById(db, id, gin.H{"sms.code": code})

	c.JSON(200, gin.H{"phone": phone, "msg": "success"})
}

func (api *User) Login(c *gin.Context) {
	db := c.MustGet("db")
	phone := c.PostForm("phone")
	code := c.PostForm("code")
	result, err := api.Model.FindOne(db, gin.H{"sms.code": code, "phone": phone, "permission": "admin"})
	fmt.Println(gin.H{"sms.code": code, "phone": phone, "permission": "admin"})
	if err != nil {
		fmt.Print(err)
		c.JSON(404, gin.H{"msg": "not found"})
		return
	}
	session := sessions.Default(c)
	session.Set("user", result["_id"].(bson.ObjectId).Hex())
	session.Set("nickname", result["nickname"])
	session.Save()
	c.JSON(200, result)
}

func (api *User) Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Set("user", nil)
	session.Save()
	c.JSON(200, gin.H{"msg": "success"})
}

func httpsPostForm(url string, data url.Values) {
	resp, err := http.PostForm(url, data)

	if err != nil {
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
	}

	fmt.Println(string(body))

}
