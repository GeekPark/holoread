package models

import (
	database "../services/db"
	// "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
)

type LikeQuery struct {
	From      bson.ObjectId `form:"from" binding:"exists"`
	Article   bson.ObjectId `form:"article" binding:"exists"`
	CreatedAt time.Time     `form:"createdAt" binding:"exists"`
}

type Like struct {
	Id        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	From      string        `json:"from" bson:"from"`
	Article   string        `json:"article" bson:"article"`
	CreatedAt time.Time     `json:"createdAt" bson:"createdAt"`
}

func (m *Base) CreateLike(params LikeQuery) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Insert(params)
	return
}

func (m *Base) FindLike(query LikeQuery) (res bson.M, err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Find(query).One(&res)
	return
}
