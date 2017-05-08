/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Question = new Base('Question', {
  user:        { type: Base.ObjectId(), ref: 'User' },
  description: String,
  title:       String,
  status:      String,
  job:         {},
  sendAt:      { type: Date, default: Date.now },
  _index:      { type: Number, default: 0, index: true }
});

const validateSchema = $.paramter.object().keys({
  title:       $.paramter.string(),
  description: $.paramter.string(),
  status:      $.paramter.string(),
  user:        $.paramter.string(),
  sendAt:      $.paramter.date().empty(''),
})
.with('title', 'description', 'user')

Question.methods.create = async function (query) {
  const { error, value } = $.paramter.validate(query, validateSchema);
  $.debug(error);
  if (error) return -1;
  query._index = await this.count({}) + 1;
  return await Question.create(query);
}

export default Question.methods


