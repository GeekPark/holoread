package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type TranslateLog struct {
	Id        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Url       string        `json:"url" bson:"url"`
	Type      string        `json:"type" bson:"type"`
	Translate string        `json:"translate" bson:"translate"`
	Origin    string        `json:"origin" bson:"origin"`
	Done      time.Time     `json: "done" bson:"done"`
}

type TranslateLogQuery struct {
	TranslateLogBaseQuery
}

type TranslateLogBaseQuery struct {
	Start int `form:"start" binding:"exists"`
	Count int `form:"count" binding:"exists"`
}

func (m *Base) TranslateLogsCount(db interface{}, q TranslateLogQuery) (int, error) {
	coll := db.(*mgo.Database).C(m.Name)
	count, err := coll.Find(bson.M{}).Count()
	return count, err
}

func (m *Base) FindTranslateLogs(db interface{}, q TranslateLogQuery) ([]bson.M, error) {
	coll := db.(*mgo.Database).C(m.Name)
	pipe := []bson.M{
		bson.M{"$match": bson.M{"origin": bson.M{"$ne": ""}, "translate": bson.M{"$ne": ""}}},
		bson.M{"$sort": bson.M{"done": -1}},
		bson.M{"$skip": q.Count * q.Start},
		bson.M{"$limit": q.Count},
	}
	resp := []bson.M{}
	err := coll.Pipe(pipe).All(&resp)
	return resp, err
}
