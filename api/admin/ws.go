package admin

import (
	"encoding/json"
	// "github.com/fatih/structs"
	"../../config"
	"../../services/encrypt"
	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/muesli/cache2go"
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

type connect struct {
	Connect *websocket.Conn
	ID      string
}

var max = 500
var upgrader = websocket.Upgrader{}
var pool = cache2go.Cache("websocket")

func addConn(c *websocket.Conn, id string) {
	if pool.Count() > max {
		log.Println("limit connect")
		return
	}
	pool.Add(id, 0, c)
}

func removeConn(id string) {
	pool.Delete(id)
}

func broadcast(coll *mgo.Collection, id string, mt int) {
	var exist []gin.H
	_ = coll.Find(bson.M{}).All(&exist)
	pool.Foreach(func(key interface{}, item *cache2go.CacheItem) {
		connect := item.Data().(*websocket.Conn)
		msg, _ := json.Marshal(gin.H{"channel": "locked", "data": exist})
		_ = connect.WriteMessage(mt, msg)
	})
	log.Println("broatcast:", pool.Count())
}

func LockConnect(c *gin.Context) {
	var conf = config.Init()
	origin := c.Request.Header.Get("Origin")
	log.Println("origin: ", origin)
	for _, s := range conf.WsAllow {
		log.Println(s)
		if s == origin {
			c.Request.Header.Del("Origin")
		}
	}

	var nickname string
	var userid string
	if sessions.Default(c).Get("user") == nil {
		userid = c.Query("userid")
		nickname = c.Query("nickname")
	} else {
		userid = sessions.Default(c).Get("user").(string)
		nickname = sessions.Default(c).Get("nickname").(string)
	}

	connect, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	defer connect.Close()
	if err != nil {
		log.Print("upgrade:", err)
		return
	}

	sid := encrypt.GetRandomString(30)
	coll := c.MustGet("db").(*mgo.Database).C("locks")
	addConn(connect, sid)
	broadcast(coll, sid, 1)

	for {
		mt, message, err := connect.ReadMessage()

		if err != nil {
			log.Println("read:", err.Error())
			_ = coll.Remove(gin.H{"sid": sid})
			removeConn(sid)
			broadcast(coll, sid, 1)
			log.Println("wwebsocket unlock: ", sid)
			break
		}

		var m lockMessage
		_ = json.Unmarshal(message, &m)

		switch m.Channel {
		case "lock":
			{
				log.Println("websocket id: ", sid)
				query := gin.H{
					"article": bson.ObjectIdHex(m.Article.ID),
					"userid":  bson.ObjectIdHex(userid),
					"sid":     sid,
				}
				var exist bson.M
				err := coll.Find(gin.H{"article": query["article"]}).One(&exist)

				if err == nil && exist["userid"].(bson.ObjectId).Hex() != userid {
					log.Printf("locked %s", exist["nickname"])
					msg, _ := json.Marshal(gin.H{
						"channel":  "lockState",
						"nickname": exist["nickname"],
						"type":     "failed",
					})
					_ = connect.WriteMessage(mt, msg)
					return
				}
				if err != nil {
					query["time"] = time.Now()
					query["nickname"] = nickname
					coll.Insert(query)
				}

				log.Printf("lock success %s %s %s", nickname, m.Article.ID, m.Article.Title)
				msg, _ := json.Marshal(gin.H{
					"channel":  "lockState",
					"nickname": nickname,
					"type":     "success",
				})
				_ = connect.WriteMessage(mt, msg)
				broadcast(coll, sid, mt)
			}
		}
		err = connect.WriteMessage(mt, message)
		if err != nil {
			log.Printf("write:", err)
			break
		}
	}
}
