package models

import (
	"gopkg.in/mgo.v2/bson"
	"time"
)

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
