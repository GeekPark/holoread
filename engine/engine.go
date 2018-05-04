package engine

import (
	"../config"
	"../routers"
	database "../services/db"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"log"
)

func GetMainEngine() *gin.Engine {
	// gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	store := database.Connect()
	logdb := database.ConnectLog()
	articledb := database.ConnectArticle()

	r.Use(setDB(logdb, "logdb"))
	r.Use(setDB(articledb, "articledb"))

	r.Use(sessions.Sessions("holoread", store))
	r.Use(corsMiddleware())
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(requestLogger())
	routers.Init(r)
	return r
}

func setDB(db *mgo.Database, name string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set(name, db)
		c.Set("config", config.Init())
		c.Next()
	}
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "application/json")
		c.Writer.Header().Set("Access-Control-Allow-Origin", c.Request.Header.Get("Origin"))
		c.Writer.Header().Set("Access-Control-Allow-Headers", "X-Requested-With,content-type")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.JSON(200, gin.H{"cors": "true"})
			return
		}
		c.Next()
	}
}

func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("%s - %s", c.Request.Method, c.Request.URL)
		c.Next()
	}
}
