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
 * @apiParam {String} openid 微信openid (微信授权获取到的信息, 全部提交)
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 **         "_id": "59142b85c92638bf4e1d8017",
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
 * @api {get} /api/v1/articles  获取所有文章
 * @apiName Index
 * @apiGroup Article
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} start 分页,默认为0
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
