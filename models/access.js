

import $    from '../utils';
import Base from './base';

const Access = new Base('Access', {
  ip:      String,
  article: { type: Base.ObjectId(), ref: 'Article', index: true},
  user:    { type: Base.ObjectId(), ref: 'User' }
});

export default Access
