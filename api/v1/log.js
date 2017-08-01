/**
 * @author eric
 * @version 1.0.0
 */
import $ from '../../utils'
import Models from '../../models'

const {LogModel} = Models

export default {
  create: async (req, res, next) => {
    const doc = await LogModel.create(req.body)
    $.result(res, doc)
  }
}
