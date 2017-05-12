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
    get:  editedTitle
  },
  edited_content: {
    type: String,
    get:  editedContent
  }
});

// custom function
function editedTitle () {
  return 'do something';
}

function editedContent () {
  return 'do something';
}

export default Article.methods


