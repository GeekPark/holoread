package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Access struct {
	Id        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	Article   bson.ObjectId `json:"article" bson:"article"`
	User      bson.ObjectId `json:"user" bson:"user"`
	Ip        string        `json:"ip" bson:"ip"`
	CreatedAt time.Time     `json: "created_at" bson:"created_at"`
}
