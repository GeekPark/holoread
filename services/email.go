package services

import (
	"../config"
	"fmt"
	"log"
	"net/smtp"
	"strings"
)

func SendEmail(to, subject, body, mailtype string) error {
	c := config.Init()
	host := c.Email.Host
	user := c.Email.User
	password := c.Email.Pass
	hp := strings.Split(host, ":")
	auth := smtp.PlainAuth("", user, password, hp[0])
	contentType := "text/plain"
	if mailtype == "html" {
		contentType = "text/html"
	}
	msg := fmt.Sprintf("To: %s\r\nFrom: %s\r\nSubject: %s\r\nContent-Type: %s; charset=UTF-8\r\n\r\n%s",
		to, user, subject, contentType, body)
	err := smtp.SendMail(host, auth, user, strings.Split(to, ","), []byte(msg))
	if err != nil {
		log.Println(err)
	}
	return err
}
