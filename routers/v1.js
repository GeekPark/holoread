/**
 * @author jk
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
// router.get('/user/:id',    V1.User.find);
// router.post('/user/add',   V1.User.create);
// router.put('/user/:id',    authToken, V1.User.update);
// router.delete('/user/:id', authToken, V1.User.delete);


//  文章

router.get('/articles',            V1.Article.all);
router.get('/article/:id',         V1.Article.find);
router.get('/articles/myArticles', V1.Article.myArticles);
router.get('/articles/myLikes',    V1.Article.myLikes);
router.get('/articles/myComments', V1.Article.myComments);

//  投票

router.get('/votes',            V1.Vote.all);
router.get('/vote/:id',         V1.Vote.find);
router.get('/votes/myVotes',    V1.Vote.myVotes);
router.get('/votes/myLikes',    V1.Vote.myLikes);
router.get('/votes/myComments', V1.Vote.myComments);

//  问答

router.get('/questions',             V1.Question.all);
router.get('/question/:id',          V1.Question.find);
router.get('/questions/myQuestions', V1.Question.myQuestions);
router.get('/questions/myLikes',     V1.Question.myLikes);
router.get('/questions/myComments',  V1.Question.myComments);


// //  喜欢

// router.post('/like', authToken, V1.Like.create);


// //  评论

// router.get('/comments',       V1.Comment.all);
// router.get('/comment/:id',    V1.Comment.find);
// router.post('/comment',       authToken, V1.Comment.create);
// router.put('/comment/:id',    authToken, V1.Comment.update);
// router.delete('/comment/:id', authToken, V1.Comment.delete);

// // log

router.post('/log', V1.Log.create);

export default router;
