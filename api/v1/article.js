/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'

const {ArticleModel, AccessModel} = Models;

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
    const date = getToday(req);
    $.debug(date);
    $.debug($.dateformat(date));
    const query = {'published' :{'$gt': date}};
    const count = await ArticleModel.count();
    const list  = await ArticleModel.model.aggregate([
                   {$sort: {published: -1}},
                   {$match: query },
                   {$lookup:{
                      from: "accesses",
                      localField: "_id",
                      foreignField: "article",
                      as: "access"
                   }},
                   {$project : {
                      origin_content: 0,
                      trans_content: 0,
                      edited_content: 0,
                   }}
                 ])
    $.result(res, {
      list: list,
      meta: {total_count: count}
    });
  }
}

function getToday (req) {
  const today = req.query.date ? (new Date(req.query.date)) : (new Date());
  today.setHours(0,0,0);
  return today;
}
