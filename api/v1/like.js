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
    if (!req.body.article && !req.body.user) {
      return $.result(res, ' params error');
    }
    const exist = await LikeModel.find(req.body);
    if ($.empty(exist)) {
      // const query = Object.assign({createdAt: new Date()}, req.body);
      $.result(res, await LikeModel.create(req.body));
    } else {
      $.result(res, exist);
    }
  },
  del: async (req, res, next) => {
    const doc = await LikeModel.delete(req.body);
    $.result(res, doc);
  }
}
