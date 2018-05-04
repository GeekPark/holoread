# Holoread

[![Build Status](https://travis-ci.org/GeekPark/holoread.svg?branch=go)](https://travis-ci.org/GeekPark/holoread)

### 说明

1. 架构

使用了 `gin` 作为基础路由框架, `mgo` 做数据库驱动, 希望提供一个 `api` 服务;

基本上是普通的 `mvc` 设计, 在控制器中避免触及到模型的核心, 在模型中不干预请求上下文,

算是对 `go` 语言的 interface 等知识点有了更深的了解


2. 只需要下面一行

``` go
restful(g, admin.InitBase(&models.User{}, "users"), "users")
```
即可创建如下路由, 并实现了对应 `CRUD` 函数
```go
[debug] GET    /users/:id
[debug] POST   /users
[debug] PUT    /users/:id
[debug] DELETE /users/:id
```

但是由于强类型, 避免使用反射, 又不支持重载, 如果需要修改以上任一 `handler`, 则需要重写其他函数,
后续会对 `restful` 函数做修改

### 部署
1. 交叉编译设置 (mac -> linux)
``` bash
cd $GOROOT/src
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 ./make.bash
```
2. 部署, 打包上传到服务器, 重启
``` bash
./deploy.sh
```

