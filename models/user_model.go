package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

type User struct {
	Id         bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	OpenId     string        `json:"openid" bson:"openid"`
	NickName   string        `json:"nickname" bson:"nickname"`
	Language   string        `json:"language" bson:"language"`
	City       string        `json:"city" bson:"city"`
	Province   string        `json:"province" bson:"province"`
	Country    string        `json:"country" bson:"country"`
	HeadImgUrl string        `json:"headimgurl" bson:"headimgurl"`
	CreatedAt  time.Time     `json:"created_at" bson:"created_at"`
	UpdatedAt  time.Time     `json:"update_at" bson:"update_at"`
	Permission []string      `json:"permission" bson:"permission"`
	Phone      int           `json:"phone" bson:"phone"`
	WeChat     string        `json:"wechat" bson:"wechat"`
	Email      string        `json:"email" bson:"email"`
	Title      string        `json:"title" bson:"title"`
	Company    string        `json:"company" bson:"company"`
	Token      string        `json:"token" bson:"token"`
	SMS        string        `json:"sms" bson:"sms"`
}
