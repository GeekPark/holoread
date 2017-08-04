package db

import (
	"../../config"
	"fmt"
	"gopkg.in/mgo.v2"
)

var c = config.Init()

// DataStore is the type for a database session
type DataStore struct {
	Session *mgo.Session
}

func Connect() *mgo.Database {
	session, err := mgo.Dial(c.MongoDB.URL)
	if err != nil {
		fmt.Println("Connected to MongoDB Error!")
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	// mgo.SetLogger(log.New(os.Stdout, "Mongo: ", 0))
	fmt.Println("Connected to MongoDB")

	ds := &DataStore{Session: session}
	db := ds.Session.DB(c.MongoDB.Name)
	return db
}

// NewDataStore returns a new datastore with a copied session
func (ds *DataStore) NewDataStore() *DataStore {
	session := ds.Session.Copy()
	return &DataStore{Session: session}
}

func (ds *DataStore) Close() {
	ds.Session.Close()
}

func (ds *DataStore) DB() *mgo.Database {
	return ds.Session.DB(c.MongoDB.Name)
}

func collectionFromSession(session *mgo.Session, name string) *mgo.Collection {
	return session.DB(c.MongoDB.Name).C(name)
}
