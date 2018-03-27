package services

import (
	"../config"
	"./encrypt"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

const url_send_sms = "https://sms.yunpian.com/v2/sms/single_send.json"

func tpl(code string) string {
	return "【好罗科技】您的验证码是" + code + "， 有效期为30分钟。请妥善保管您的验证码，勿透露给他人"
}

func SendSms(phone string) (code string) {
	code = encrypt.GetRandomNumber(6)
	conf := config.Init()
	data_send_sms := url.Values{"apikey": {conf.Yunpian}, "mobile": {phone}, "text": {tpl(code)}}
	httpsPostForm(url_send_sms, data_send_sms)
	return
}

func httpsPostForm(url string, data url.Values) {
	resp, err := http.PostForm(url, data)

	if err != nil {
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
	}

	fmt.Println(string(body))

}
