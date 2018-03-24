package main

import (
	"flag"
	"log"

	V1 "../../api/v1"
	database "../db"
	"github.com/bot-api/telegram"
	"github.com/bot-api/telegram/telebot"
	"golang.org/x/net/context"
	// "gopkg.in/mgo.v2"
	"../../config"
	"gopkg.in/mgo.v2/bson"
	"strings"
)

func main() {
	db, _ := database.Connect()
	coll := db.C("articles")

	match := bson.M{"is_cn": false}

	token := flag.String("token", config.TelegramToken, "telegram bot token")
	debug := flag.Bool("debug", true, "show debug information")
	flag.Parse()

	if *token == "" {
		log.Fatal("token flag is required")
	}

	api := telegram.New(*token)
	api.Debug(*debug)
	bot := telebot.NewWithAPI(api)
	bot.Use(telebot.Recover()) // recover if handler panic

	netCtx, cancel := context.WithCancel(context.Background())
	defer cancel()

	bot.HandleFunc(func(ctx context.Context) error {
		log.Println("message")
		update := telebot.GetUpdate(ctx) // take update from context
		if update.Message == nil {
			return nil
		}
		api := telebot.GetAPI(ctx) // take api from context
		if update.Message.Text == "" {
			update.Message.Text = "at 我干嘛?"
		}
		msg := telegram.CloneMessage(update.Message, nil)

		_, err := api.Send(ctx, msg)
		return err

	})
	// Use command middleware, that helps to work with commands
	bot.Use(telebot.Commands(map[string]telebot.Commander{
		"news": telebot.CommandFunc(
			func(ctx context.Context, arg string) error {
				list := V1.TestArticle(coll, match, 0, 5)
				var newList []string
				// newList = append(newList, "HoloNews")
				for i := 0; i < len(list); i++ {
					item := list[i].(bson.M)
					str := item["edited_title"].(string) + "\n" + item["url"].(string) + "\n"
					newList = append(newList, str)
				}
				newListStr := strings.Join(newList, "\n")
				api := telebot.GetAPI(ctx)
				update := telebot.GetUpdate(ctx)
				msg := telegram.NewMessagef(update.Chat().ID, newListStr, arg)
				// msg.ParseMode = telegram.MarkdownMode
				_, err := api.SendMessage(ctx, msg)
				return err
			}),
	}))
	err := bot.Serve(netCtx)
	if err != nil {
		log.Fatal(err)
	}
}
