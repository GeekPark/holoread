#! /bin/bash
echo 'pack'
cd ../
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build app.go
tar -zcvf app.tar.gz app
echo 'upload'
scp app.tar.gz  holoread:/home/dev/www/holoread-go
echo 'delete local files'
rm app
rm app.tar.gz
echo 'restart'
ssh -t holoread "pwd && cd www/holoread-go && ./restart.sh"
