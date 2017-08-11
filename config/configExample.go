package config

// import (
// 	"github.com/gin-gonic/gin"
// 	"gopkg.in/mgo.v2"
// 	"log"
// 	"time"
// )

// type Config struct {
// 	Port    string
// 	MongoDB *mgo.DialInfo
// 	Secret  string
// 	WsAllow []string
// 	Email   *Email
// }

// type Email struct {
// 	User string
// 	Pass string
// 	Host string
// }

// const Yunpian = ""

// var conf *Config

// func debug() *Config {
// 	mongo := &mgo.DialInfo{
// 		Addrs:    []string{""},
// 		Timeout:  60 * time.Second,
// 		Database: "shareading",
// 		Username: "",
// 		Password: "",
// 	}
// 	e := &Email{
// 		User: "",
// 		Pass: "",
// 		Host: "",
// 	}
// 	return &Config{
// 		Port:    "3000",
// 		MongoDB: mongo,
// 		Email:   e,
// 		Secret:  "",
// 		WsAllow: []string{"http://127.0.0.1:8080"},
// 	}
// }

// func release() *Config {
// 	mongo := &mgo.DialInfo{
// 		Addrs:    []string{""},
// 		Timeout:  60 * time.Second,
// 		Database: "shareading",
// 		Username: "",
// 		Password: "",
// 	}
// 	e := &Email{
// 		User: "",
// 		Pass: "",
// 		Host: "",
// 	}
// 	return &Config{
// 		Port:    "3000",
// 		MongoDB: mongo,
// 		Email:   e,
// 		Secret:  "holoread",
// 		WsAllow: []string{"", "http://127.0.0.1:8080"},
// 	}
// }

// func Init() *Config {
// 	log.Println("ENV: ", gin.Mode())
// 	if conf != nil {
// 		return conf
// 	}
// 	if gin.Mode() == "debug" {
// 		conf = debug()
// 	} else if gin.Mode() == "release" {
// 		conf = release()
// 	}
// 	return conf
// }
