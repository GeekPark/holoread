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

const order = {'$gt': -1};

export default {

  show: async (req, res) => {
    const ip    = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    const query = {article: req.params.id, ip: ip};
    const exist = await AccessModel.find(query);
    if ($.empty(exist)) { await AccessModel.create(query); }
    $.result(res, await ArticleModel.findById(req.params.id));
  },


  index: async (req, res) => {
    const date       = await lastDate(req);
    const query      = {'published' :{'$lt': date}, order: order};
    const list       = await queryArticles(query);
    const hotList    = hot(list);
    const editedList = edited(hotList.concat(list));

    $.result(res, {
      list: filterLiked(editedList, req.query.user || ''),
      total: await ArticleModel.count(query)
    });
  },


  myLikes: async (req, res) => { // 我的收藏
    let queryDate, isLimit;

    if (req.query.last) {
      queryDate = {'$lt': new Date(req.query.last)};
      isLimit   = true;
    } else {
      queryDate = {'$lte': someDay(req)};
      isLimit   = false;
    }
    const user       = mongoose.Types.ObjectId(req.params.user);
    const query      = {createdAt : queryDate, from: user};
    const list       = await queryLikes(query, isLimit);
    const hotList    = hot(list);
    const editedList = edited(hotList.concat(list));

    $.result(res, {
      list: hotList,
      total: await LikeModel.count(query)
    });
  }
}

async function queryLikes (query, isLimit) {
  const limit = isLimit ? {$limit: 20} : {$limit: 100};
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
                 {$project: {
                    article: Object.assign(selectArticle)
                 }},
                 limit
               ]).allowDiskUse(true);
  return list.map(el => {
    el.created_at = $.dateformat(el.createdAt);
    return el;
  });
}


async function queryArticles (query) {
  const list  = await ArticleModel.model.aggregate([
                 {$sort: {published: -1}},
                 {$match: query },
                 selectLike,
                 selectAccess,
                 {$project: selectArticle},
                 {$limit: 20}
                ]).allowDiskUse(true);
  return list;
}


function someDay (req, hours = 24) {
  const today = req.query.date ? (new Date(req.query.date)) : (new Date());
  today.setHours(hours, 0, 0);
  return today;
}

async function lastDate (req) {
  if (req.query.last === 'now') {
    const recent = await helper.getRecent();
    return new Date(recent.published);
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
    if (!el.edited_title) {
      el.edited_title = el.trans_title;
    }
    if (!el.edited_content) {
      el.edited_content = el.trans_content || '';
    }

    const summary = delHtmlTag(el.edited_content);
    el.summary    = !el.summary ? summary.substr(0, 100) : el.summary;
    el.published  = $.dateformat(el.published);

    delete el.trans_title;
    delete el.edited_content;
    delete el.trans_content;

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
