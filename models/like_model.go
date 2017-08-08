package models

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type LikeQuery struct {
	From      bson.ObjectId `form:"from" binding:"exists"`
	Article   bson.ObjectId `form:"article" binding:"exists"`
	CreatedAt time.Time     `form:"created_at" binding:"exists"`
}

type Like struct {
	Id        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	From      string        `json:"from" bson:"from"`
	Article   string        `json:"article" bson:"article"`
	CreatedAt time.Time     `json:"created_at" bson:"created_at"`
}

func (m *Base) CreateLike(db interface{}, params LikeQuery) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Insert(params)
	return
}

func (m *Base) FindLike(db interface{}, query LikeQuery) (res bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(query).One(&res)
	return
}
