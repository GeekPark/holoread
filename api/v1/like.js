/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'


const {LikeModel} = Models;

export default {
  create: async (req, res, next) => {
    if ($.empty(req.body.article)) {
      return $.result(res, ' params error');
    }

    const query = {article: req.body.article, from: req.user._id};
    const exist = await LikeModel.find(query);

    if ($.empty(exist)) {
      await LikeModel.create(query)
      return $.result(res, 'success', 200);
    }

    $.result(res, 'repeat like');
  },


  del: async (req, res, next) => {
    const query = {article: req.params.id, from: req.user._id};
    const doc = await LikeModel.deleteBy(query);
    $.result(res, doc);
  }
}
