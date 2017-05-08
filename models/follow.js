

import $    from '../utils';
import Base from './base';

const Follow = new Base('Follow', {
  from:    { type: Base.ObjectId(), ref: 'User' , required: true},
  article: { type: Base.ObjectId(), ref: 'Article' },
  user:    { type: Base.ObjectId(), ref: 'User' },
});

export default Follow.methods
