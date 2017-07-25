/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'
import mongoose from 'mongoose'
import helper from '../../admin/helper'

const {ArticleModel, AccessModel, LikeModel} = Models;
const cn = /[\u4E00-\u9FA5\uF900-\uFA2D]/;

const selectAccess = {$lookup:{
  from:         "accesses",
  localField:   "_id",
  foreignField: "article",
  as:           "accesses"
}};

const selectLike = {$lookup:{
  from:         "likes",
  localField:   "_id",
  foreignField: "article",
  as:           "likes"
}};

const selectArticle = {
  origin_content: 0,
  origin_title: 0,
};

export default {

  show: async (req, res) => {

    const ip    = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    const query = {article: req.params.id, ip: req.query.id || ip};
    const access = await AccessModel.find(query);

    if ($.empty(access)) { await AccessModel.create(query);};

    const article = await ArticleModel.findById(req.params.id);

    if ($.empty(article)) { return $.result(res, 'query error');}

    const like = await LikeModel.find({article: req.params.id, from: req.query.user});

    article.is_like = !$.empty(like);
    article.is_cn = cn.test(article.origin_title);

    if (article.is_cn) {
      article.edited_content = article.origin_content;
      article.edited_title = article.origin_title;
    }

    $.result(res, article);
  },


  index: async (req, res) => {

    const date       = await lastDate(req, -24);
    const query      = {'published' :{'$gt': date, '$ne': date},
                        "$nor": [{ state: 'pending' }, { state: 'deleted' } ]
                       };
    const list       = await queryArticles(query, req.query.limit);
    const hotList    = hot(list);
    const editedList = edited(hotList);

    $.result(res, {
      list: filterLiked(editedList, req.query.user || '')
    });
  },


  myLikes: async (req, res) => { // 我的收藏
    const date       = await lastDate(req, 24);
    const user       = mongoose.Types.ObjectId(req.params.user);
    const query      = {createdAt : {'$lt': date}, from: user};
    const list       = await queryLikes(query, req.query.limit);
    const hotList    = hot(list);
    const editedList = edited(hotList);

    $.result(res, {list: editedList});
  }
}


async function queryLikes (query, limit = 20) {
  const list  = await LikeModel.model.aggregate([
                 {$sort: {createdAt: -1}},
                 {$match: query},
                 {$lookup:{
                    from: "articles",
                    localField: "article",
                    foreignField: "_id",
                    as: "article"
                 }},
                 {$lookup:{
                    from: "likes",
                    localField: "article",
                    foreignField: "article",
                    as: "likes"
                 }},
                 {$limit: parseInt(limit)}
               ]).allowDiskUse(true);
  return list.map(el => {
    el = Object.assign(el, el.article[0]);
    delete el.article;
    el.created_at = $.dateformat(el.createdAt);
    return el;
  });
}


async function queryArticles (query, limit = 20) {
  const list  = await ArticleModel.model.aggregate([
                 {$match: query },
                 {$sort: {published: 1}},
                 {$limit: parseInt(limit)},
                 selectLike,
                 selectAccess,
                ]).allowDiskUse(true);
  return list;
}


function lastDate (req, hours = 0) {
  if (req.query.last === 'now') {
    const today = new Date();
    today.setHours(hours);
    return today;
  } else {
    return new Date(req.query.last);
  }
}

function hot (list) {
  return list.map(el => {
    el.hot = false;
    el.accesses = el.accesses ? el.accesses.length : 0;
    if (el.likes * 10 + el.accesses >= 20) {el.hot = true;}
    return el;
  })
}

function edited (list) {
  return list.map(el => { // 聚合查询后 getter 失效
    if (el.origin_title === undefined) {return}

    if (!el.edited_title) {
      el.edited_title = el.trans_title;
    }
    if (!el.edited_content) {
      el.edited_content = el.trans_content || '';
    }

    const summary = delHtmlTag(el.edited_content);
    el.summary    = !el.summary ? summary.substr(0, 100) : el.summary;
    el.published  = $.dateformat(el.published);
    el.is_cn      = cn.test(el.origin_title);

    if (el.is_cn) {
      el.edited_content = el.origin_content;
      el.edited_title = el.origin_title;
    }

    delete el.trans_title;
    delete el.trans_content;
    delete el.edited_content;
    delete el.origin_title;
    delete el.origin_content;

    return el;
  })
}

function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g,"");//去掉所有的html标记
}

function filterLiked (list, userid) {
  return list.map(el => {
    el.is_like = el.likes.length > 0 ? el.likes.some(sub => sub.from.toString() === userid.toString()) : false;
    return el;
  })
}
