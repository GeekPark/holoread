/**
 * @author eric
 * @version 1.0.0
 */
import $ from '../utils'
import Models from '../models'
import Base from './base'
import helper from './helper'

const ArticleModel = Models.ArticleModel
const ArticleAPI = new Base(ArticleModel)
const LIMIT = 20

const cnReg = /[\u4E00-\u9FA5\uF900-\uFA2D]/

ArticleAPI.show = async (req, res) => {
  const article = await ArticleModel.findById(req.params.id)
  const newArticle = handleIsCn(article)
  $.result(res, newArticle)
}

ArticleAPI.update = async function (req, res) {
  const exist = await ArticleModel.updateBy({_id: req.params.id}, req.body)
  if (exist === -1) return $.result(res, 'update failed')
  $.result(res, exist)
}

ArticleAPI.index = async function (req, res) {
  let _query = {}
  let isSkip = false
  const {last = '',
          first = '',
          limit = LIMIT,
          value = '',
          language = '',
          key = '',
          state = '0'} = req.query

  if (state !== '0') {
    _query.state = state
  }
  if (state === 'handled') {
    delete _query.state
    _query['$nor'] = [ { state: 'pending' }, { state: 'deleted' } ]
  }
  if (language === 'cn') {
    _query.origin_title = {$regex: '[\u4e00-\u9fa5]'}
  } else if (language === 'en') {
    _query.origin_title = {$regex: '^[^\u4e00-\u9fa5]+$'}
  }
  if (key !== '' && value !== '') {
    _query[key] = { $regex: value, $options: 'i' }
  }

  $.debug(_query)

  if (last !== '') {
    _query['published'] = {'$lt': new Date(last)}
  } else if (first !== '') {
    isSkip = true
    _query['published'] = {'$gt': new Date(first)}
  } else {
    const now = new Date()
    const yesterday = new Date(now.setHours(-24 * 7))
    _query['published'] = {'$lte': new Date()}
  }

  $.debug(_query)

  try {
    const count = await ArticleModel.count(_query)
    const tempCount = (count - limit) > 0 ? (count - limit) : 0
    const skip = isSkip ? {$skip: tempCount} : {$skip: 0}
    const list = await ArticleModel.model.aggregate([
      { $match: _query },
      { $project: {
          origin_content: 0,
          trans_content: 0,
          edited_content: 0,
          tags: 0,
          url: 0,
          source: 0,
          updatedAt : 0,
          summary: 0
        }
      },
      skip,
      { $limit: 40 }
    ])
    list.forEach(handleIsCn)
    $.result(res, {list: list, count: count})
  } catch (e) {
    $.debug(e)
    $.result(res, 'error')
  }
}

function handleIsCn (el) {
  el.is_cn = cnReg.test(el.origin_title)
  if (el.is_cn) {
    el.edited_title = el.origin_title
  }
  // delete el.trans_title
  // delete el.origin_title
  return el
}

export default ArticleAPI
