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
  is_like:        Boolean,
  is_cn:          Boolean,
  summary:        {type: String, default: ''},
  url:            {type: String, default: ''},
  source:         {type: String, default: ''},
  published:      {type: Date, index: true},
  lock:           {type: Base.ObjectId(), ref: 'User'},
  state:          {type: String, default: ''},
  tags:           {type: [String], default: []},
  edited_title:   {type: String, default: ''},
  edited_content: {type: String, default: ''}
});


Article.schema.path('edited_title')
.get(function(val) {
    return $.empty(val) ? this.trans_title : val;
})

Article.schema.path('edited_content')
.get(function(val) {
    return $.empty(val) ? this.trans_content : val;
})

export default Article


