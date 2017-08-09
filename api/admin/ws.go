package admin

import (
	"encoding/json"
	"flag"
	// "github.com/fatih/structs"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"time"
)

type lockMessage struct {
	Channel string         `json:"channel"`
	Article articleMessage `json:"article"`
}

type articleMessage struct {
	Title string `json:"edited_title"`
	ID    string `json:"_id"`
}

var addr = flag.String("*", "127.0.0.1:3000", "http service address")
var upgrader = websocket.Upgrader{}

func WsConnect(c *gin.Context) {
	userid := sessions.Default(c).Get("user").(string)
	nickname := sessions.Default(c).Get("nickname").(string)
	origin := c.Request.Header.Get("Origin")
	whiteList := "http://127.0.0.1:8080"
	if origin == whiteList {
		c.Request.Header.Del("Origin")
	}

	connect, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	defer connect.Close()

	for {
		mt, message, err := connect.ReadMessage()

		if err != nil {
			log.Println("read:", err.Error())
			if err.Error() == "websocket: close 1001 (going away)" {
			}
			break
		}
		// log.Printf("recv: %s", message)
		var m lockMessage
		_ = json.Unmarshal(message, &m)
		switch m.Channel {
		case "lock":
			{
				query := gin.H{
					"article": bson.ObjectIdHex(m.Article.ID),
					"userid":  bson.ObjectIdHex(userid),
				}
				coll := c.MustGet("db").(*mgo.Database).C("locks")
				var exist bson.M
				err := coll.Find(query).One(&exist)
				if err == nil && exist["userid"].(bson.ObjectId).Hex() != userid {
					log.Printf("locked %s", nickname)
					msg, _ := json.Marshal(gin.H{
						"channel":  "lockState",
						"nickname": nickname,
						"type":     "failed",
					})
					_ = connect.WriteMessage(mt, msg)
					return
				}
				log.Printf("lock success %s %s", nickname, m.Article.Title)
				query["time"] = time.Now()
				query["nickname"] = nickname
				coll.Insert(query)
				msg, _ := json.Marshal(gin.H{
					"channel":  "lockState",
					"nickname": nickname,
					"type":     "success",
				})
				_ = connect.WriteMessage(mt, msg)
			}
		}
		err = connect.WriteMessage(mt, message)
		if err != nil {
			log.Printf("write:", err)
			break
		}
	}
}
