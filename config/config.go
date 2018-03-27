package config

import (
	"github.com/gin-gonic/gin"
	"github.com/koding/multiconfig"
	"gopkg.in/mgo.v2"
	"log"
	"os"
	"strings"
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
	Test        *Server
}

var conf *Env

func Init() *Server {

	if conf == nil {
		log.Println("Current env: ", gin.Mode())
		pwd, err := os.Getwd()
		if err != nil {
			log.Println(err)
			os.Exit(1)
		}

		log.Println("Current dir: ", pwd)
		configPath := pwd + "/config/config.yaml"

		if gin.Mode() == gin.TestMode {
			configPath = strings.Replace(configPath, "/test", "", -1)
		}
		log.Println("Config dir:", configPath)
		m := multiconfig.NewWithPath(configPath)
		conf = new(Env)
		m.MustLoad(conf)
	}

	if gin.Mode() == gin.DebugMode {
		return conf.Development
	} else if gin.Mode() == gin.ReleaseMode {
		return conf.Production
	} else if gin.Mode() == gin.TestMode {
		return conf.Test
	}
	return conf.Development
}
