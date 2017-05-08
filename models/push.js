/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Push = new Base('Push', {
  content:     String,
  contentId:   String,
  contentType: String,
  link:        String,
  messageId:   String,
  scheduleId:  String,
  status:      { type: String, default: 'notpush' },
  now:         { type: Boolean, default: true },
  pushAt:      { type: Date, default: Date.now },
  user:        { type: Base.ObjectId(), ref: 'User' }
});

Push.methods.create = async function (query) {
  if ($.isEmpty(query.content) || $.isEmpty(query.user)) return -1;
  if ($.isEmpty(query.pushAt) && query.now) query.pushAt = Date.now();
  return await Push.create(query);
};

export default Push.methods
