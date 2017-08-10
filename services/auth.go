package services

import (
	"fmt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// 验证管理员
func AuthSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)
		fmt.Println("current user: ", session.Get("nickname"), session.Get("user"))
		if session.Get("user") == nil {
			c.JSON(400, gin.H{"msg": "session error"})
			c.Abort()
		} else {
			c.Set("user", session.Get("user"))
			c.Set("nickname", session.Get("nickname"))
			c.Next()
		}
	}
}

func AuthToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}
