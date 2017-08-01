/**
 * @author eric
 * @version 1.0.0
 */
import $ from '../utils'
import Models from '../models'

export default async function (req, res, next) {
  const {kw, value, type, start = 0} = req.query
  const query = {}

  query[`${kw}`] = { $regex: value, $options: 'i' }
  const model = Models[`${type}Model`]

  if ($.empty(model)) { return $.result(res, 'error') }

  const docs = await model.all(query, start)
  const count = await model.count(query)
  $.result(res, {
    list: docs,
    meta: {
      total_count: count,
      limit_value: 20
    }
  })
}
