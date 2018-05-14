package db

import (
	"../../config"
	// sessions "github.com/gin-contrib/sessions"
	mongo "github.com/gin-contrib/sessions/mongo"
	"gopkg.in/mgo.v2"
	"log"
	"time"
)

// SessionStore  is the type for a database session
type SessionStore struct {
	Session *mgo.Session
}

var mainSession *mgo.Session

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
	ds := &SessionStore{Session: session}
	ds.Session.SetSocketTimeout(1 * time.Hour)
	db := ds.Session.DB(c.LogMongoDB.Database)
	return db
}

func Connect() mongo.Store {
	c := config.Init()
	var err error
	mainSession, err = mgo.DialWithInfo(c.MongoDB)
	if err != nil {
		log.Println("Connected to MongoDB Error!")
		panic(err)
	}

	mainSession.SetSocketTimeout(1 * time.Hour)
	mainSession.SetMode(mgo.Monotonic, true)
	log.Println("Connected to MongoDB", c.MongoDB.Addrs, c.MongoDB.Database)

	db := NewSessionStore().DB()
	coll := db.C("sessions")
	store := mongo.NewStore(coll, 30*24*3600, true, []byte(c.Secret))
	return store
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

	ds := &SessionStore{Session: session}
	ds.Session.SetSocketTimeout(1 * time.Hour)
	db := ds.Session.DB(c.LogMongoDB.Database)
	return db
}

// NewSessionStore  returns a new SessionStore  with a copied session
func NewSessionStore() *SessionStore {
	ds := &SessionStore{
		Session: mainSession.Copy(),
	}
	return ds
}

func (ds *SessionStore) Close() {
	ds.Session.Close()
}

func (ds *SessionStore) C(name string) *mgo.Collection {
	return ds.Session.DB(config.Init().MongoDB.Database).C(name)
}

func (ds *SessionStore) DB() *mgo.Database {
	return ds.Session.DB(config.Init().MongoDB.Database)
}

func collectionFromSession(session *mgo.Session, name string) *mgo.Collection {
	return session.DB(config.Init().MongoDB.Database).C(name)
}
