package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

type Log struct {
	Id        bson.ObjectId `json:"_id" bson:"_id,omitempty"`
	User      string        `json:"user" bson:"user"`
	Type      string        `json:"type" bson:"type"`
	Event     string        `json:"event" bson:"event"`
	CreatedAt time.Time     `json:"created_at" bson:"created_at"`
}
