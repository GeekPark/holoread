#! /bin/bash
echo "build"
go get github.com/koding/multiconfig
go get github.com/muesli/cache2go
go get github.com/gin-gonic/gin
go get gopkg.in/mgo.v2
pwd
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build app.go
