/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';
import helper from './helper';
import mongoose from 'mongoose';

const ArticleModel = Models.ArticleModel;
const ArticleAPI = new Base(ArticleModel);
const LIMIT = 20;

const cnReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;

ArticleAPI.show =  async (req, res) => {
  const article = await ArticleModel.findById(req.params.id);
  const newArticle = handleIsCn(article);
  $.result(res, article);
}


ArticleAPI.update = async function (req, res) {
  const exist = await ArticleModel.updateBy({_id: req.params.id}, req.body);
  if (exist === -1) return $.result(res, 'update failed');
  $.result(res, exist);
}

ArticleAPI.index = async function (req, res) {
    let _query = {}, isSkip = false;
    const {last  = '',
          first = '',
          limit = LIMIT,
          title = null,
          language = '',
          state = ''} = req.query;

    if (last !== '') {
      _query = {'published' :{'$lt': new Date(last)}};
    } else if (first !== '') {
      isSkip = true;
      _query = {'published' :{'$gt': new Date(first)}};
    } else {
      const recent = await helper.getRecent();
      _query = {'published' :{'$lte': new Date(recent.published)}};
    }

    if (title !== null) {_query.trans_title = { $regex: title, $options: 'i' };}
    if (state !== '0') {_query.state = state;}
    if (state === 'handled') {
      delete _query.state
      _query["$nor"] = [{ state: 'pending' }, { state: 'deleted' } ];
    }
    if (language === 'cn') {
      _query.origin_title = {$regex:"[\u4e00-\u9fa5]"};
    } else if (language === 'en') {
      _query.origin_title = {$regex:"^[^\u4e00-\u9fa5]+$"};
    }


    $.debug(_query)

    try {
      const count = await ArticleModel.count(_query);
      const skip = isSkip ? {$skip: count - limit} : {$skip: 0};
      const list = await ArticleModel.model.aggregate([
                     { $match: _query },
                     { $sort: {published: -1}},
                     skip,
                     { $limit: parseInt(limit) },
                     { $project: {
                         origin_content: 0
                     }},
                     { $lookup:
                         {
                          from: "accesses",
                          localField: "_id",
                          foreignField: "article",
                          as: "accesses"
                         }
                     },
                     { $lookup:
                         {
                          from: "likes",
                          localField: "_id",
                          foreignField: "article",
                          as: "likes"
                         }
                     }
                   ])
      list.forEach(handleIsCn)
      $.result(res, {list: list, count: count});
    } catch (e) {
      $.debug(e)
      $.result(res, 'error');
    }
}

function handleIsCn(el) {
  el.is_cn = cnReg.test(el.origin_title);
  if (el.is_cn) {
    el.edited_content = el.origin_content;
    el.edited_title = el.origin_title;
  }
  return el;
}

export default ArticleAPI
