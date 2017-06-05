/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'
import mongoose from 'mongoose'

const {ArticleModel, AccessModel, LikeModel} = Models;

const select = [{$lookup:{
                    from: "accesses",
                    localField: "_id",
                    foreignField: "article",
                    as: "accesses"
                 }},
                 {$lookup:{
                    from: "likes",
                    localField: "_id",
                    foreignField: "article",
                    as: "likes"
                 }},
                 {$project : {
                    origin_content: 0,
                    trans_content: 0,
                    edited_content: 0,
                 }}];

export default {

  show: async (req, res) => {
    const ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
    const query = {article: req.params.id, ip: ip};
    const exist = await AccessModel.find(query);
    if ($.empty(exist)) {
      await AccessModel.create(query);
    }
    $.result(res, await ArticleModel.findById(req.params.id));
  },

  index: async (req, res) => {
    const date = getSomeDay(req, 0);
    const query = {'published' :{'$gt': date}};
    const list = await queryArticles(query);
    const hot = getHotArticle(list);
    $.result(res, {
      list: hot.concat(list),
      meta: {total_count: await ArticleModel.count()}
    });
  },

  myLikes: async (req, res) => {
    const date = getSomeDay(req, -48);
    const user = mongoose.Types.ObjectId(req.params.user);
    const query = {createdAt :{'$gt': date}, from: user};
    const list = await queryLikes(query);
    $.result(res, {
      list,
      meta: {total_count: await LikeModel.count()}
    });
  }
}

function getSomeDay (req, hours) {
  const today = req.query.date ? (new Date(req.query.date)) : (new Date());
  today.setHours(hours,0,0);
  return today;
}

function getHotArticle (list) {
  const hot = [];
  list.forEach((el, index) => {
    el.likes = el.likes.length;
    el.accesses = el.accesses.length;
    if (el.likes * 10 + el.accesses >= 20) { // hot
      hot.push(el);
      list.splice(index, 1);
    }
  })
  // hot.sort(function(a, b){
  //   if(keyA < keyB) return -1;
  //   if(keyA > keyB) return 1;
  //   return 0;
  // });
  return hot;
}


async function queryLikes (query) {
  const list  = await LikeModel.model.aggregate([
                 {$sort: {createdAt: -1}},
                 {$match: query }
               ]);
  return list;
}


async function queryArticles (query) {
  // $.debug(date);
  // $.debug($.dateformat(date));
  const list  = await ArticleModel.model.aggregate([
                 {$sort: {published: -1}},
                 {$match: query }
                ].concat(select));
  return list;
}
