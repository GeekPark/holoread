package models

import (
	database "../services/db"
	"github.com/gin-gonic/gin"
	// "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Base struct {
	M    interface{}
	Name string
}

type BaseMethods interface {
	Count(bson.M) (int, error)
	Find(bson.M) ([]bson.M, error)
	FindOne(bson.M) (bson.M, error)
	FindById(string) (bson.M, error)
	Create(bson.M) ([]bson.M, error)
	Update(string, bson.M) error
	Delete(string) error
}

func InitBase(m interface{}, name string) *Base {
	return &Base{m, name}
}

func (m *Base) Count(query gin.H) (count int, err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	count, err = coll.Find(query).Count()
	return
}

func (m *Base) Find(query gin.H) (res []bson.M, err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Find(query).All(&res)
	return
}

func (m *Base) FindOne(query gin.H) (res bson.M, err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Find(query).One(&res)
	return
}

func (m *Base) FindById(id string) (res bson.M, err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Find(bson.M{"_id": bson.ObjectIdHex(id)}).One(&res)
	return
}

func (m *Base) Create(params gin.H) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Insert(params)
	return
}

func (m *Base) UpdateById(id bson.ObjectId, params gin.H) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Update(bson.M{"_id": id},
		bson.M{"$set": params})
	return
}

func (m *Base) UpdateOneBy(query gin.H, params gin.H) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Update(query, bson.M{"$set": params})
	return
}

func (m *Base) Update(id string, params gin.H) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Update(bson.M{"_id": bson.ObjectIdHex(id)},
		bson.M{"$set": params})
	return
}

func (m *Base) UpdateList(list []string, params gin.H) error {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	var err error
	for _, id := range list {
		e := coll.Update(bson.M{"_id": bson.ObjectIdHex(id)}, bson.M{"$set": params})
		if e != nil {
			err = e
		}
	}
	return err
}

func (m *Base) Delete(id string) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Remove(bson.M{"_id": bson.ObjectIdHex(id)})
	return
}

func (m *Base) DeleteBy(p gin.H) (err error) {
	ds := database.NewSessionStore()
	defer ds.Close()
	coll := ds.C(m.Name)
	err = coll.Remove(p)
	return
}
