package db

import (
	"../../config"
	sessions "github.com/gin-contrib/sessions"
	"gopkg.in/mgo.v2"
	"log"
)

// DataStore is the type for a database session
type DataStore struct {
	Session *mgo.Session
}

func ConnectArticle() *mgo.Database {
	c := config.Init()
	c.LogMongoDB.Database = "magic_mirror_article"
	session, err := mgo.DialWithInfo(c.LogMongoDB)
	if err != nil {
		log.Println("Connected to ArticleDB Error!")
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	log.Println("Connected to ArticleDB", c.LogMongoDB.Addrs, c.LogMongoDB.Database)
	ds := &DataStore{Session: session}
	db := ds.Session.DB(c.LogMongoDB.Database)
	return db
}

func Connect() (*mgo.Database, sessions.MongoStore) {
	c := config.Init()
	session, err := mgo.DialWithInfo(c.MongoDB)
	if err != nil {
		log.Println("Connected to MongoDB Error!")
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	log.Println("Connected to MongoDB", c.MongoDB.Addrs, c.MongoDB.Database)

	ds := &DataStore{Session: session}
	db := ds.Session.DB(c.MongoDB.Database)
	coll := db.C("sessions")
	store := sessions.NewMongoStore(coll, 30*24*3600, true, []byte(c.Secret))
	return db, store
}

func ConnectLog() *mgo.Database {
	c := config.Init()
	session, err := mgo.DialWithInfo(c.LogMongoDB)
	if err != nil {
		log.Println("Connected to LogMongoDB Error!")
		panic(err)
	}

	session.SetMode(mgo.Monotonic, true)
	// mgo.SetLogger(log.New(os.Stdout, "Mongo: ", 0))
	log.Println("Connected to LogMongoDB", c.LogMongoDB.Addrs, c.LogMongoDB.Database)

	ds := &DataStore{Session: session}
	db := ds.Session.DB(c.LogMongoDB.Database)
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
	return ds.Session.DB(config.Init().MongoDB.Database)
}

func collectionFromSession(session *mgo.Session, name string) *mgo.Collection {
	return session.DB(config.Init().MongoDB.Database).C(name)
}
