#! /bin/bash
echo "deps"
go get github.com/koding/multiconfig
go get github.com/muesli/cache2go
go get github.com/gin-gonic/gin
go get gopkg.in/mgo.v2
go get github.com/gin-contrib/sessions
go get github.com/gorilla/websocket
go get -u -v  github.com/gavv/httpexpect
pwd
echo "add config file"
cp config/config.example.yaml config/config.yaml
# cat config/config.yaml
echo "test"
export GIN_MODE=test
go test -v -cover test/*
