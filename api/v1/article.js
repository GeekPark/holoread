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
    const list = await ArticleModel.all({}, req.query);
    const count = await ArticleModel.count();
    $.result(res, {
      list: list,
      meta: {
        total_count: count,
        limit_value: 20,
      }
    });
  }
}
