# shareading
> dependency: express  mongoose pm2 logjs4 jade moment supertest mocha...

[![Build Status](https://travis-ci.org/GeekPark/shareading.svg?branch=master)](https://travis-ci.org/GeekPark/shareading)
[![Code Climate](https://codeclimate.com/github/GeekPark/shareading/badges/gpa.svg)](https://codeclimate.com/github/GeekPark/shareading)

### 运行

``` bash
# 安装依赖
yarn install

# 开发模式运行
npm run dev

# 生产模式运行
npm run prod

# 测试模式运行
npm run test

# 查看测试覆盖率
npm run cover

# 生成文档
npm run doc
访问文档: http://127.0.0.1:3000

```

# 部署
``` bash
pm2 deploy processes.json production setup

// cp config.simple.json config.json

pm2 deploy processes.json production
```


### 依赖说明 2017-03-29
    "body-parser":     "~1.15.1", // body parser
    "compression":     "^1.6.2",  // 压缩
    "connect-mongo":   "^1.3.2",  // session to mongoose
    "cookie-parser":   "~1.4.3",  // cookie parser
    "cors":            "^2.8.1",  // 跨域
    "debug":           "~2.2.0",  // debug
    "express":         "~4.13.4", // 主框架
    "express-session": "^1.15.1", // session
    "joi":             "^10.2.2", // 参数校验
    "jpush-sdk":       "^3.3.1",  // 极光推送
    "js-yaml":         "^3.8.2",  // .yaml 解析
    "jsonwebtoken":    "^7.3.0",  // token
    "log4js":          "^1.1.0",  // log
    "method-override": "^2.3.7",  // method rewrite
    "moment":          "^2.17.1", // format time
    "mongoose":        "^4.7.5",  // orm
    "morgan":          "~1.7.0",  // log
    "node-schedule":   "^1.2.0",  // 定时
    "qiniu":           "^6.1.13"  // 上传图片 token


### 结构
```
.
├── README.md
├── app.js
├── api_router_v1.js
├── package.json
├── processes.json
├── config.js
├── models/*
├── controllers/*
├── services/*
├── bin/*
├── test/*
└── public/*
``` bash
```
