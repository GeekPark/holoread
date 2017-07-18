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

async function findEditing(req) {
  const exist = await ArticleModel.model
                                  .findOne({_id: req.params.id})
                                  .populate('editing');
  if ($.empty(exist.editing) ||
    req.session.user._id === exist.editing._id.toString()) return {code: 1, exist: exist};
  return {code: -1, exist: exist};
}


ArticleAPI.editing = async function (req, res) {
  const result = await findEditing(req);
  const {exist} = result;
  if (result.code === -1) return $.result(res, exist, 400);
  exist.editing = req.session.user._id;
  await ArticleModel.update(exist);
  $.result(res, exist);

}

ArticleAPI.update = async function (req, res) {
  let exist = await findEditing(req);
  if (exist === -1) return $.result(res, exist, 400);
  exist = await ArticleModel.updateBy({_id: req.params.id}, Object.assign({editing: null}, req.body));
  if (exist === -1) return $.result(res, 'update failed');
  $.result(res, exist);
}

ArticleAPI.index = async function (req, res) {
    let _query = {}, isSkip = false;
    const {last  = '', first = '', limit = LIMIT, title = null} = req.query;


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
      const cn = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
      list.forEach(el => {
        el.is_cn = cn.test(el.origin_title);
      })
      $.result(res, {
        list: list,
        meta: {
          total_count: count,
          limit_value: parseInt(limit),
        }
      });
    } catch (e) {
      $.debug(e);
      $.result(res, 'error');
    }
}

export default ArticleAPI
