/**
 * @author eric
 * @version 1.0.0
 */

import $      from '../utils';
import auth   from '../utils/auth';
import Models from '../models';
import Base   from './base';

const {UserModel}   = Models;
const UserAPI       = new Base(UserModel);
const {createToken} = auth;

UserAPI.create = async function (req, res, next) {
  const result = await UserModel.create(req.body);
  result.token = createToken({_id: result._id});
  $.result(res, await UserModel.update(result));
}

UserAPI.login = async function (req, res, next) {
  const { error, value } = $.paramter.validate(req.body,
    $.paramter.object().keys({
    email: $.paramter.string(),
    password: $.paramter.string()
  }));

  if (error) return $.result(res, 'params error');

  let docs = await UserModel.find(value);

  if ($.empty(docs)) return $.result(res, 'login failed');

  req.session.user = docs;
  res.cookie('email', docs.email, { maxAge: 900000 });
  $.result(res, docs);
}


UserAPI.logout = async function (req, res, next) {
  res.cookie('email', null);
  req.session.user = null;
  $.result(res, {});
}


UserAPI.resetPassword = async function (req, res, next) {
  let query = Object.assign({}, req.body);
  if ($.empty(query.old) || $.empty(query.new)) {
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
