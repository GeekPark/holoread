package models

import (
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

func (m *Base) Count(db interface{}, query bson.M) (count int, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	count, err = coll.Find(query).Count()
	return
}

func (m *Base) Find(db interface{}, query bson.M) (res []bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(query).All(&res)
	return
}

func (m *Base) FindOne(db interface{}, query bson.M) (res bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(query).One(&res)
	return
}

func (m *Base) FindById(db interface{}, id string) (res bson.M, err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&res)
	return
}

func (m *Base) Create(db interface{}, params bson.M) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Insert(params)
	return
}

func (m *Base) Update(db interface{}, id string, params bson.M) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Update(bson.M{"_id": bson.ObjectIdHex(id)},
		bson.M{"$set": params})
	return
}

func (m *Base) Delete(db interface{}, id string) (err error) {
	coll := db.(*mgo.Database).C(m.Name)
	err = coll.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	return
}