// demo:

/**
 * @api {method} /api/v1/address do something
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
 * @api {post} /api/v1/user/login 微信登录
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
 *         _id:    "xxx",
 *         token:  "xxx (请保存到客户端, 每次请求附带)",
 *         others: "xxx"
 *       },
 *       "msg": ""
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "status -1 (需要输入邀请码)"
 *     }
 */

/**
 * @api {post} /api/v1/user/verify  验证邀请码 (用于用户初次登录)
 * @apiName Verify
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiParam {String} openid 微信openid
 * @apiParam {String} code 邀请码
 *
 * @apiExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *         _id:    "xxx",
 *         others: "..."
 *       },
 *       "msg": ""
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403
 *     {
 *       "data": "",
 *       "msg" : "openid not found"
 *     }
 */
