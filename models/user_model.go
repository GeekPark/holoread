package models

import (
	database "../services/db"
	// "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type UserQuery struct {
	Start    int    `form:"start" binding:"exists"`
	Count    int    `form:"count" binding:"exists"`
	Nickname string `form:"nickname" binding:"exists"`
	Phone    string `form:"phone" binding:"exists"`
}

type UserUpdate struct {
	Nickname   string   `form:"nickname"`
	Phone      string   `form:"phone"`
	State      string   `form:"state"`
	Permission []string `form:"permission[]"`
}

type LoginParams struct {
	OpenId     string    `json:"openid"`
	Phone      string    `json:"phone"`
	Token      string    `json:"token"`
	Code       string    `json:"code"`
	NickName   string    `json:"nickname"`
	Language   string    `json:"language"`
	City       string    `json:"city"`
	Province   string    `json:"province"`
	Country    string    `json:"country"`
	HeadImgUrl string    `json:"headimgurl"`
	CreatedAt  time.Time `json:"CreatedAt"`
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
	Email      string        `json:"email" bson:"email"`
	Title      string        `json:"title" bson:"title"`
	State      string        `json:"state" bson:"state"`
	Company    string        `json:"company" bson:"company"`
	Token      string        `json:"token" bson:"token"`
	SMS        bson.M        `json:"sms" bson:"sms"`
}

func (m *Base) FindUsers(q UserQuery) ([]bson.M, error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	selector := bson.M{}

	if q.Nickname != "" { // 查询全部
		selector["nickname"] = bson.M{"$regex": q.Nickname, "$options": "$i"}
	}
	if q.Phone != "" {
		selector["phone"] = bson.M{"$regex": q.Phone, "$options": "$i"}
	}
	selector["$nor"] = []bson.M{bson.M{"state": "deleted"}}

	var result []bson.M
	err := coll.Find(selector).
		Sort("-createdAt").
		Skip(q.Count * q.Start).
		Limit(q.Count).
		Select(bson.M{"token": 0}).
		All(&result)
	return result, err
}

func (m *Base) UpdateUser(id string, params UserUpdate) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Update(bson.M{"_id": bson.ObjectIdHex(id)},
		bson.M{"$set": params})
	return
}

func (m *Base) CreateUser(params LoginParams) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	params.CreatedAt = time.Now()
	err = coll.Insert(params)
	return
}
