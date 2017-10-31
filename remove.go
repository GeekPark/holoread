package main

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
)

func RemoveTwo(db interface{}) {
	log.Println("begin")
	coll := db.(*mgo.Database).C("articles")
	var result []bson.M
	var pipe = []bson.M{
		bson.M{"$match": bson.M{"url": bson.M{"$ne": ""}}},
		bson.M{"$group": bson.M{
			"_id":   bson.M{"url": "$url"},
			"dups":  bson.M{"$addToSet": "$_id"},
			"count": bson.M{"$sum": 1},
		}},
		bson.M{"$match": bson.M{
			"count": bson.M{"$gt": 1},
		}},
	}
	err := coll.Pipe(pipe).All(&result)
	if err != nil {
		log.Println(err)
	}
	log.Println(len(result))

	for i := 0; i < len(result); i++ {
		item := result[i]
		dups := item["dups"].([]interface{})
		for j := 1; j < len(dups); j++ {
			log.Println(dups[j])
			err = coll.Remove(bson.M{"_id": dups[j].(bson.ObjectId)})
			if err != nil {
				log.Println(err)
			}
		}

	}
	if err != nil {
		log.Println(err)
	}
}
