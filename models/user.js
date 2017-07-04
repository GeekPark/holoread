/**
 * @author eric
 * @version 1.0.0
 */

import $    from '../utils';
import Base from './base';

const User = new Base('User', {
  openid:     String,
  gender:     Number,
  language:   String,
  city:       String,
  province:   String,
  country:    String,
  headimgurl: String,
  token:      String,
  company:    String,
  title:      String,
  sign:       String,
  password:   String,
  email:      String,
  wechat:     String,
  phone:      { type: String, default: ''},
  verifyCode: String, // 短信验证码
  permission: { type: Array, default: ['visitor'] },
  state:      { type: Number, default: -1 },
  sms:        {
    code: String,
    time: Date,
  },
  nickname:   {
    type:    String,
    index:   true,
    default: '用户' + Math.random().toString(36).substring(20),
  }
});

export default User
