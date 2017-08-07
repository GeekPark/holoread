package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Like struct {
	Id        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	User      string        `json:"user" bson:"user"`
	ToUser    string        `json:"touser" bson:"touser"`
	Article   string        `json:"article" bson:"article"`
	CreatedAt time.Time     `json:"created_at" bson:"created_at"`
}
