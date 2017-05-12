/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'


const {LogModel} = Models;

export default {
  create: async function (req, res, next) {
    const doc = await LogModel.create(req.body);
    $.result(res, doc);
  }
}
