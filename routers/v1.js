/**
 * @author eric
 * @version 1.0.0
 */

import express from 'express'
import api     from '../api'
import auth    from '../utils/auth'
import $       from '../utils'

const authToken = auth.authToken;
const router    = express.Router();
const {V1}      = api;

//  用户

router.post('/user/login',  V1.User.login);
router.post('/user/verify', V1.User.verify);

router.post('/log', V1.Log.create);

export default router;
