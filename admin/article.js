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


ArticleAPI.index = async function (req, res, next) {
    let _query = {};
    const {last  = '', first = '', limit = LIMIT} = req.query;

    if (last !== '') {
      _query = {'published' :{'$lt': new Date(last)}};
    } else if (first !== '') {
      _query = {'published' :{'$gt': new Date(first)}};
    } else {
      const recent = await helper.getRecent();
      _query = {'published' :{'$lte': recent.published}};
    }
    try {
      const list = await ArticleModel.model.aggregate([
                     { $sort: {published: -1}},
                     { $match: _query },
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
                     },
                     { $limit: 20 }
                   ])
      // const list = await ArticleModel.model.find({}).limit(20).sort({published: -1});
      const count = await ArticleModel.count();
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
