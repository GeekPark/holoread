/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Like = new Base('Like', {
  user:    { type: Base.ObjectId(), ref: 'User' },
  article: { type: Base.ObjectId(), ref: 'Article' }
});

Like.methods.create = async function (query) {
  if ($.isEmpty(query.user) || $.isEmpty(query.article)) { return -1; }
  return await Like.create(query);
};

export default Like.methods
