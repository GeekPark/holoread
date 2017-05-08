/**
 * @author jk
 * @version 1.0.0
 */

import $      from '../utils';
import auth   from '../utils/auth';
import Models from '../models';
import Base   from './base';

const {UserModel} = Models;
const UserAPI     = new Base(UserModel);


// 1 生成邀请码
// 2 创建用户
// 3 生成 token
// 4 根据用户 id 更新 token, 返回
UserAPI.create = async function (req, res, next) {
  const query = Object.assign({code: $.inviteCode()}, req.body);
  const user  = await UserModel.create(query);
  user.token  = auth.createToken({user: user._id});
  $.result(res, await UserModel.update(user));
}

UserAPI.login = async function (req, res, next) {
  const { error, value } = $.paramter.validate(req.body,
    $.paramter.object().keys({
    email: $.paramter.string(),
    password: $.paramter.string()
  }));

  if (error) return $.result(res, 'params error');

  let docs = await UserModel.find({
    "email.addr": value.email,
    "password": value.password
  });
  if ($.isEmpty(docs)) return $.result(res, 'login failed');

  req.session.user = docs;
  res.cookie('email', docs.email.addr, { maxAge: 900000 });
  $.result(res, docs);
}


UserAPI.logout = async function (req, res, next) {
  res.cookie('email', null);
  req.session.user = null;
  $.result(res, {});
}


UserAPI.resetPassword = async function (req, res, next) {
  let query = Object.assign({}, req.body);
  if ($.isEmpty(query.old) || $.isEmpty(query.new)) {
    return $.result(res, 'params error');
  }
  if (query.old === query.new) return $.result(res, 'same password');

  let docs = await UserModel.update({
    _id: req.session.user._id
  }, {
    password: query.new
  });
  if (docs === -1) return $.result(res, 'reset failed');

  req.session.user = docs;
  $.result(res, docs);
}

export default UserAPI
