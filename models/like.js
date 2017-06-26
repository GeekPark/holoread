

import $    from '../utils';
import Base from './base';

const Like = new Base('Like', {
  from:    { type: Base.ObjectId(), ref: 'User' , required: true},
  article: { type: Base.ObjectId(), ref: 'Article' },
  user:    { type: Base.ObjectId(), ref: 'User' }
});

export default Like
