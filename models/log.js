/**
 * @author jk
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const Log = new Base('Log', {
  event: { type: String, default: '' },
  type:  { type: String, default: '' },
  user:  { type: Base.ObjectId(), ref: 'User' }
});

export default Log.methods
