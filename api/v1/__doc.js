// demo:

/**
 * @api {method} /api/v1/url do something
 * @apiName xxx
 * @apiGroup xxx
 * @apiVersion 1.0.0
 *
 * @apiParam {String} openid 微信openid
 * @apiParam {String} nickname 昵称
 * @apiParam {String}  avatar  头像
 *
 * @apiSuccess {Object} data.
 * @apiSuccess {String} msg.
 *
 * @apiExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {},
 *       "msg": ""
 *     }
 */



// User

/**
 * @api {post} /api/v1/login/wechat 微信登录
 * @apiName  Login
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} openid 微信openid
 * @apiParam {Number} gender 性别, 男1, 女0
 * @apiParam {String} province 省份
 * @apiParam {String} city  城市
 * @apiParam {String} headimgurl 头像
 * @apiParam {String} nickname 昵称
 * @apiParam {String} language 语言
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *
 *       "data": {
 *         "_id": "59142b85c92638bf4e1d8017",
 *          "updatedAt": "2017-05-11T09:29:42.708Z",
 *          "createdAt": "2017-05-11T09:14:45.997Z",
 *          "token": "...",
 *          "nickname": "...",
 *          "state": -1,
 *          "permission": [
 *            "visitor"
 *          ],
 *          "updated_at": "2017-05-11 17:29:42",
 *          "created_at": "2017-05-11 17:14:45"
 *       },
 *       "msg": ""
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400
 *     {
 *       "data": "",
 *       "msg" : "..."
 *     }
 */

/**
 * @api {post} /api/v1/sms/verify  验证 短信验证码
 * @apiName VerifySms
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} phone 手机号
 * @apiParam {String} code 邀请码
 * @apiParam {String} openid openid
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "验证成功",
 *       "data": {}
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": {},
 *       "msg" : "验证失败"
 *     }
 */

/**
 * @api {post} /api/v1/sms/new  发送短信验证码
 * @apiName  NewSMS
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} phone 手机号
 * @apiParam {String} openid openid
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *       },
 *       "msg": "发送成功"
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "发送失败"
 *     }
 */

/**
 * @api {get} /api/v1/articles  获取所有文章(默认当天)
 * @apiName Index
 * @apiGroup Article
 * @apiVersion 1.0.0
 *
 * @apiParam {String} last 本页最后一个 item 的 published (例如 ?last=2017-05-10T08:42:58.000Z)
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "msg": "",
 *       "data": {
 *         "list": [],
 *         "meta": {
 *           "total_count": 0,
 *           "limit_value": 20
 *         }
 *       }
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "..."
 *     }
 */

/**
 * @api {get} /api/v1/articles/:user/likes 获取用户收藏文章
 * @apiName Get
 * @apiGroup Article
 * @apiVersion 1.0.0
 * @apiParam {String} last 本页最后一个 item 的 created_at
 *
 *
 * @apiExample {json} Success-Response:
 *     分两次请求 第一次不带参数, 请求为当天收藏, 无分页
 *     第二次请求过往收藏数据, 有分页 带上 ?last=
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *       },
 *       "msg": ""
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "..."
 *     }
 */

/**
 * @api {post} /api/v1/logs  创建日志
 * @apiName Create
 * @apiGroup Log
 * @apiVersion 1.0.0
 *
 * @apiParam {String} token token
 * @apiParam {String} type 日志类型
 * @apiParam {String} event 日志事件
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *       },
 *       "msg": ""
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "..."
 *     }
 */

/**
 * @api {post} /api/v1/likes 收藏文章
 * @apiName Create
 * @apiGroup Like
 * @apiVersion 1.0.0
 *
 * @apiParam {String} from  当前用户ID
 * @apiParam {String} article 文章 ID
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *       },
 *       "msg": ""
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "..."
 *     }
 */

/**
 * @api {delete} /api/v1/likes/:id 删除收藏文章
 * @apiName Delete
 * @apiGroup Like
 * @apiVersion 1.0.0
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *       },
 *       "msg": ""
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "..."
 *     }
 */
