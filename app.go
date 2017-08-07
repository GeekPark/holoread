package main

import (
	"./routers"
	database "./services/db"
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"gopkg.in/mgo.v2"
)

func main() {
	r := gin.New()
	db, store := database.Connect()
	r.Use(SetDB(db))
	sessionMiddleware := sessions.Sessions("holoread", store)
	r.Use(sessionMiddleware)
	r.Use(CORSMiddleware())
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
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://127.0.0.1:8080")
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
		fmt.Printf("%s - %s", c.Request.Method, c.Request.URL)
		c.Next()
	}
}
