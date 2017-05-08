

import $    from '../utils';
import Base from './base';

const Invitation = new Base('Invitation', {
  user:    { type: String, default: '' },
  article: { type: Base.ObjectId(), ref: 'Article' },
  to:      { type: Base.ObjectId(), ref: 'User' },
});

export default Invitation.methods
