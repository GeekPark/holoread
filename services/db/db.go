package db

import (
	"../../config"
	sessions "github.com/gin-contrib/sessions"
	"gopkg.in/mgo.v2"
	"log"
)

var c = config.Init()

// DataStore is the type for a database session
type DataStore struct {
	Session *mgo.Session
}

func Connect() (*mgo.Database, sessions.MongoStore) {
	session, err := mgo.DialWithInfo(c.MongoDB)
	if err != nil {
		log.Println("Connected to MongoDB Error!")
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	// mgo.SetLogger(log.New(os.Stdout, "Mongo: ", 0))
	log.Println("Connected to MongoDB")

	ds := &DataStore{Session: session}
	db := ds.Session.DB(c.MongoDB.Database)
	coll := db.C("sessions")
	store := sessions.NewMongoStore(coll, 3600*30, true, []byte(c.Secret))
	return db, store
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
	return ds.Session.DB(c.MongoDB.Database)
}

func collectionFromSession(session *mgo.Session, name string) *mgo.Collection {
	return session.DB(c.MongoDB.Database).C(name)
}
