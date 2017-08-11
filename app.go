package main

import (
	"./routers"
	database "./services/db"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
	"log"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	db, store := database.Connect()
	r.Use(SetDB(db))
	r.Use(sessions.Sessions("holoread", store))
	r.Use(CORSMiddleware())
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(RequestLogger())
	routers.Init(r)
	r.Run(":4000")
}

func SetDB(db *mgo.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("db", db)
		c.Next()
	}
}

func CORSMiddleware() gin.HandlerFunc {
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

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Printf("%s - %s", c.Request.Method, c.Request.URL)
		c.Next()
	}
}
