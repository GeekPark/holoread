/**
 * @author eric
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Article = new Base('Article', {
  origin_title:   String,
  origin_content: String,
  trans_title:    String,
  trans_content:  String,
  summary:        String,
  url:            String,
  source:         String,
  published:      Date,
  order: {
    type:    Number,
    default: 0
  },
  added: {
    type:    Date,
    default: Date.now
  },
  tags: {
    type:    [String],
    default: []
  },
  edited_title: {
    type: String,
    default: ''
  },
  edited_content: {
    type: String,
    default: ''
  }
});


Article.schema.path('edited_title')
.get(function(val) {
    return $.empty(val) ? this.trans_title : val;
})

Article.schema.path('edited_content')
.get(function(val) {
    return $.empty(val) ? this.trans_content : val;
})

Article.methods.model = Article.model;

export default Article.methods


