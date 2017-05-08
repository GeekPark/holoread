/**
 * @author eric
 * @version 1.0.0
 */

import express from 'express'
import Admin   from '../admin'
import Base     from './base'

const router     = express.Router();
const BaseRouter = new Base(router);

// 账号
router.post('/account/login',         Admin.User.login);
router.post('/account/logout',        Admin.User.logout);
router.post('/account/resetPassword', Admin.User.resetPassword);

// 搜索
router.get('/search',  Admin.Search);

export default BaseRouter.resources('/users',    Admin.User)
                         .resources('/articles', Admin.Article)
                         .resources('/follows',  Admin.Follow)
                         .resources('/logs',     Admin.Log)
                         .router;
