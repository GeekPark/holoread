package models

import (
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type UserQuery struct {
	Start    int    `form:"start" binding:"exists"`
	Count    int    `form:"count" binding:"exists"`
	Nickname string `form:"nickname" binding:"exists"`
}

type UserUpdate struct {
	Nickname   string   `form:"nickname"`
	Phone      string   `form:"phone"`
	Permission []string `form:"permission[]"`
}

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

func (m *Base) FindUsers(db interface{}, q UserQuery) ([]bson.M, error) {
	coll := db.(*mgo.Database).C(m.Name)
	selector := bson.M{}

	if q.Nickname != "" { // 查询全部
		selector["nickname"] = bson.M{"$regex": q.Nickname, "$options": "$i"}
	}

	var result []bson.M
	err := coll.Find(selector).
		Sort("-created_at").
		Skip(q.Count * q.Start).
		Limit(q.Count).
		Select(bson.M{"token": 0}).
		All(&result)
	return result, err
}

func (m *Base) UpdateUser(db interface{}, id string, params UserUpdate) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	fmt.Println(params)
	err = coll.Update(bson.M{"_id": bson.ObjectIdHex(id)},
		bson.M{"$set": params})
	return
}
