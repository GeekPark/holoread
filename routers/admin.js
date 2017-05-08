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


//  文章
// router.put('/article/update/index', Admin.Article.updateIndex);


// 七牛上传 token
router.get('/services/uptoken',  Admin.Service.uptoken);


// 搜索
router.get('/search',  Admin.Search);


// 统计
router.get('/statistics/total',  Admin.Statistics.total);


export default BaseRouter.rest('/users',      Admin.User)
                         .rest('/articles',   Admin.Article)
                         .rest('/activities', Admin.Activity)
                         .rest('/votes',      Admin.Vote)
                         .rest('/questions',  Admin.Question)
                         .rest('/answers',    Admin.Answer)
                         .rest('/likes',      Admin.Like)
                         .rest('/comments',   Admin.Comment)
                         .rest('/logs',       Admin.Log)
                         .rest('/push',       Admin.Push)
                         .router;
