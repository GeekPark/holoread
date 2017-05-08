/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Answer = new Base('Answer', {
  user:        { type: Base.ObjectId(), ref: 'User' },
  question:    { type: Base.ObjectId(), ref: 'Question' },
  content:     String,
  status:      String,
});

const validateSchema = $.paramter.object().keys({
  content:     $.paramter.string(),
  question:    $.paramter.string(),
})
.with('content', 'question')

Answer.methods.create = async function (query) {
  const { error, value } = $.paramter.validate(query, validateSchema);
  $.debug(error);
  if (error) return -1;
  return await Answer.create(query);
}

export default Answer.methods


