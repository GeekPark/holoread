package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type ArticleQuery struct {
	Start int `form:"start" binding:"exists"`
	Limit int `form:"limit" binding:"exists"`
}

type Article struct {
	Id             bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Edited_Title   string        `json:"edited_title" bson:"edited_title"`
	Edited_Content string        `json:"edited_content" bson:"edited_content"`
	Trans_Title    string        `json:"trans_title" bson:"trans_title"`
	Trans_Content  string        `json:"trans_content" bson:"trans_content"`
	Origin_Title   string        `json:"origin_title" bson:"origin_title"`
	Origin_Content string        `json:"origin_content" bson:"origin_content"`
	Summary        string        `json:"summary" bson:"summary"`
	Url            string        `json:"url" bson:"url"`
	Source         string        `json:"source" bson:"source"`
	CN             bool          `json:"is_cn" bson:"is_cn"`
	State          string        `json:"state" bson:"state"`
	Published      time.Time     `json:"published" bson:"published"`
	CreatedAt      time.Time     `json:"created_at" bson:"created_at"`
}

func (m *Base) FindArticles(db interface{}, q ArticleQuery) ([]bson.M, error) {
	coll := db.(*mgo.Database).C(m.Name)
	var result []bson.M
	err := coll.Find(bson.M{}).
		Sort("-published").
		Skip(q.Limit * q.Start).
		Limit(q.Limit).
		Select(bson.M{"trans_title": 1, "published": 1, "state": 1, "is_cn": 1}).
		All(&result)
	return result, err
}
