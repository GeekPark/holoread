package models

import (
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Base struct {
	M    interface{}
	Name string
}

type BaseMethods interface {
	Count(interface{}, bson.M) (int, error)
	Find(interface{}, bson.M) ([]bson.M, error)
	FindOne(interface{}, bson.M) (bson.M, error)
	FindById(interface{}, string) (bson.M, error)
	Create(interface{}, bson.M) ([]bson.M, error)
	Update(interface{}, string, bson.M) error
	Delete(interface{}, string) error
}

func InitBase(m interface{}, name string) *Base {
	return &Base{m, name}
}

func (m *Base) Count(db interface{}, query gin.H) (count int, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	count, err = coll.Find(query).Count()
	return
}

func (m *Base) Find(db interface{}, query gin.H) (res []bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(query).All(&res)
	return
}

func (m *Base) FindOne(db interface{}, query gin.H) (res bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(query).One(&res)
	return
}

func (m *Base) FindById(db interface{}, id string) (res bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&res)
	return
}

func (m *Base) Create(db interface{}, params gin.H) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Insert(params)
	return
}

func (m *Base) UpdateById(db interface{}, id bson.ObjectId, params gin.H) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Update(bson.M{"_id": id},
		bson.M{"$set": params})
	return
}

func (m *Base) UpdateOneBy(db interface{}, query gin.H, params gin.H) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Update(query, bson.M{"$set": params})
	return
}

func (m *Base) Update(db interface{}, id string, params gin.H) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Update(bson.M{"_id": bson.ObjectIdHex(id)},
		bson.M{"$set": params})
	return
}

func (m *Base) UpdateList(db interface{}, list []string, params gin.H) error {
	coll := db.(*mgo.Database).C(m.Name)
	var err error
	for _, id := range list {
		e := coll.Update(bson.M{"_id": bson.ObjectIdHex(id)}, bson.M{"$set": params})
		if e != nil {
			err = e
		}
	}
	return err
}

func (m *Base) Delete(db interface{}, id string) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	return
}

func (m *Base) DeleteBy(db interface{}, p gin.H) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Remove(p)
	return
}
