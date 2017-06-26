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
    if (!req.body.article && !req.body.user) {return $.result(res, 'error');}
    const doc = await LikeModel.create(req.body);
    $.result(res, doc);
  },
  del: async (req, res, next) => {
    const doc = await LikeModel.delete(req.body);
    $.result(res, doc);
  }
}
