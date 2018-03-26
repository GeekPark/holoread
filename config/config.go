package config

import (
	"github.com/gin-gonic/gin"
	"github.com/koding/multiconfig"
	"gopkg.in/mgo.v2"
	"log"
)

type Server struct {
	Port          string
	Secret        string
	Yunpian       string
	TelegramToken string
	WsAllow       []string
	MongoDB       *mgo.DialInfo
	LogMongoDB    *mgo.DialInfo
	Email         *Email
}

type Email struct {
	User     string
	Pass     string
	Host     string
	Receiver string
}

type Env struct {
	Development *Server
	Production  *Server
}

var conf *Env

func Init() *Server {

	if conf == nil {
		log.Println("Current env: ", gin.Mode())
		m := multiconfig.NewWithPath("config/config.yaml")
		conf = new(Env)
		m.MustLoad(conf)
	}

	if gin.Mode() == gin.DebugMode {
		return conf.Development
	} else if gin.Mode() == gin.ReleaseMode {
		return conf.Production
	}
	return conf.Development
}
