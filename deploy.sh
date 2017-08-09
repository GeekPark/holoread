#! /bin/bash
echo 'pack'
GIN_MODE=release CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build app.go
tar -zcvf app.tar.gz app
echo 'upload'
scp app.tar.gz  holoread:/home/dev/www/holoread-go
echo 'restart'
ssh -t holoread "pwd && cd www/holoread-go && ./restart.sh"
