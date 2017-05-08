/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Vote = new Base('Vote', {
  title:       String,
  status:      String,
  points:      Array,
  user:        { type: Base.ObjectId(), ref: 'User' },
  status:      String,
  sendAt:      { type: Date, default: Date.now },
  multiSelect: Boolean
});


export default Vote.methods
