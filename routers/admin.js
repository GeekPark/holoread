/**
 * @author jk
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


// 统计
// router.get('/statistics/total',  Admin.Statistics.total);


export default BaseRouter.rest('/users',      Admin.User)
                         .rest('/articles',   Admin.Article)
                         .rest('/comments',   Admin.Comment)
                         .router;
