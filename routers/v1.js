/**
 * @author eric
 * @version 1.0.0
 */

import express from 'express'
import api     from '../api'
import auth    from '../utils/auth'
import $       from '../utils'

const {authToken} = auth;
const {V1}   = api;

const router = express.Router();


//  用户

router.post('/login/wechat', V1.User.wechatLogin);
router.post('/sms/verify',   V1.User.verifySms);
router.post('/sms/new',      V1.User.createSms);
router.post('/log',          V1.Log.create);

export default router;
