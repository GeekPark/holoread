# Holoread

### 说明

使用了 `gin` 作为基础路由框架, `mgo` 做数据库驱动, 希望提供一个 `api` 服务;


### 运行
```bash
# in gopath
brew install gpm
git clone https://github.com/GeekPark/shareading.git
cd shareading
gpm install
go run app.go
```

### 部署
1. 交叉编译设置 (mac -> linux)

``` bash
cd $GOROOT/src
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 ./make.bash
```
2. 部署, 打包上传到服务器, 重启, 只需要在本机执行以下脚本

``` bash
./deploy.sh
```

### 测试

``` bash
go test -v -cover test/*
```

### 文件结构

``` bash
.
├── LICENSE
├── README.md
├── api
│   ├── admin                      # 后台 api
│   │   ├── access_admin.go        # 访问记录
│   │   ├── article_admin.go       # 文章
│   │   ├── base_admin.go          # base
│   │   ├── login_admin.go         # 登录
│   │   ├── translate_log_admin.go # 翻译日志
│   │   ├── user_admin.go          # 用户
│   │   └── ws.go                  # websocket
│   └── v1                         # v1版本 api
│       ├── article_v1.go          # 文章
│       ├── base_v1.go             # base
│       ├── holonews_v1.go         # holonews
│       ├── like_v1.go #           # 收藏
│       ├── log_v1.go              # 日志
│       ├── login_v1.go            # 登录
│       └── setting_v1.go          # 设置
├── app.go                         # 入口
├── config                         # 配置文件
│   ├── config.example.yaml
│   ├── config.go
│   └── config.yaml
├── engine                         # app engine
│   └── engine.go
├── models                         # models
│   ├── access_model.go
│   ├── article_model.go
│   ├── base_model.go
│   ├── like_model.go
│   ├── log_model.go
│   ├── translate_log_model.go
│   └── user_model.go
├── routers                        # 路由
│   └── routers.go
├── services                       # 一些服务
│   ├── db                         # 数据库， 一共连接三个
│   │   └── db.go
│   ├── email.go                   # 邮件服务
│   ├── encrypt                    # 加密
│   │   └── encrypt.go
│   ├── keywords                   # holonews 关键词服务 python 实现
│   │   ├── LICENSE
│   │   ├── __pycache__
│   │   │   └── test.cpython-36.pyc
│   │   ├── config.example.json
│   │   ├── config.json
│   │   ├── server.py
│   │   ├── stopwords.txt
│   │   ├── test.py
│   │   └── words.txt
│   ├── sms.go                     # 短信服务
│   └── telegram                   # telegram bot 服务
│       ├── bot
│       ├── bot.go
│       ├── bot.tar.gz
│       ├── deploybot.sh
│       └── restart.sh
├── sh                             # 一些脚本
│   ├── build.sh 
│   ├── deploy.sh
│   ├── restart.sh
│   └── unique.go
```

### 相关文章

* [对 holoread 项目的思考](https://ericjj.com/2018/03/23/%E5%AF%B9holoread%E9%A1%B9%E7%9B%AE%E7%9A%84%E6%80%9D%E8%80%83/)
* [Go 项目中如何对 API 进行测试？](https://ericjj.com/2018/03/27/Go-%E9%A1%B9%E7%9B%AE%E4%B8%AD%E5%A6%82%E4%BD%95%E5%AF%B9-API-%E8%BF%9B%E8%A1%8C%E6%B5%8B%E8%AF%95%EF%BC%9F/)

### 吐槽
go 是种一点都不函数式, 和函数式八竿子打不着的语言....



