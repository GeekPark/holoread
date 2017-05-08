/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Activity = new Base('Activity', {
  user:        { type: Base.ObjectId(), ref: 'User' },
  location:    String,
  title:       String,
  description: String,
  headerImg:   String,
  sendAt:      Date,
  beginAt:     Date,
  endAt:       Date,
  status:      'send',
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
  headerImg:   $.paramter.string().empty(''),
  location:    $.paramter.string(),
  sendAt:      $.paramter.date().empty(''),
  beginAt:     $.paramter.date().empty(''),
  endAt:       $.paramter.date().empty(''),
})
.with('title', 'description', 'location')

Activity.methods.create = async function (query) {
  const { error, value } = $.paramter.validate(query, validateSchema);
  $.debug(error);
  if (error) return -1;
  value._index = await this.count({}) + 1;
  return await Activity.create(value);
}

export default Activity.methods


