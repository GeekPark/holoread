/**
 * @author eric
 * @version 1.0.0
 */

import express from 'express'
import api     from '../api'
import auth    from '../utils/auth'
import $       from '../utils'
import Base    from './base'

// 验证 token, 加载用户, 按需使用
const {authToken, loadUser} = auth;
const {V1}   = api;

const router     = express.Router();
const BaseRouter = new Base(router);

// 微信登录
router.post('/login/wechat', V1.User.wechatLogin);
// 验证短信
router.post('/sms/verify',   V1.User.verifySms);
// 发送短信
router.post('/sms/new',      V1.User.createSms);

export default BaseRouter.resources('/articles', V1.Article)
                         .resources('/logs',     V1.Log)
                         .router;
