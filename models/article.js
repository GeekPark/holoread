/**
 * @author eric
 * @version 1.0.0
 */

import $ from '../utils'
import Base from './base'

const Article = new Base('Article', {
  origin_title: {type: String, index: true},
  origin_content: String,
  trans_title: {type: String, index: true},
  trans_content: String,
  is_like: Boolean,
  is_cn: Boolean,
  summary: {type: String, default: ''},
  url: {type: String, index: true},
  source: {type: String, index: true},
  published: {type: Date, index: true},
  lock: {type: Base.ObjectId(), ref: 'User'},
  state: {type: String, default: ''},
  tags: {type: [String], default: []},
  edited_title: {type: String, default: '', index: true},
  edited_content: {type: String, default: ''}
})

Article.schema.path('edited_title')
.get(function (val) {
  return $.empty(val) ? this.trans_title : val
})

Article.schema.path('edited_content')
.get(function (val) {
  return $.empty(val) ? this.trans_content : val
})

Article.schema.index({trans_title: 1, published: -1})

export default Article
