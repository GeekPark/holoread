#! /bin/bash
echo 'pack'
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build bot.go
tar -zcvf bot.tar.gz bot
echo 'upload'
scp bot.tar.gz  holoread:/home/dev/www/holoread-tg-bot
echo 'restart'
ssh -t holoread "pwd && cd www/holoread-tg-bot && ./restart.sh"
