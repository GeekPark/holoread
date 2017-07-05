/**
 * @author eric
 * @version 1.0.0
 */

import $      from '../utils';
import auth   from '../utils/auth';
import cipher from '../utils/cipher';
import Models from '../models';
import Base   from './base';

const {UserModel}   = Models;
const UserAPI       = new Base(UserModel);
const {sign} = auth;

UserAPI.login = async function (req, res) {
  const {phone, code} = req.body;

  if ($.empty(phone) || $.empty(code)) return $.result(res, 'params error');

  const exist = await UserModel.find({phone: phone, 'permission': 'admin'});
  if ($.empty(exist)) return $.result(res, 'permission denied');
  if (exist.sms.code !== code) return $.result(res, 'code error');

  req.session.user = exist;
  $.result(res, exist);
}

UserAPI.sms = async function (req, res) {
  const {phone} = req.body;
  const code = $.createCode();
  const sms = {code: code, time: $.DateAdd("mi", 30, new Date())};

  if ($.empty(phone)) return $.result(res, 'params error');

  const exist = UserModel.find({phone: req.body.phone, 'permission': 'admin'});
  if ($.empty(exist)) return $.result(res, 'permission denied');

  await UserModel.updateBy({phone: phone}, {sms: sms});
  const result = await $.createSms(phone, code);
  if (result === -1) {return $.result(res, '发送失败');}
  $.result(res, '发送成功', 200);
}

UserAPI.logout = async function (req, res) {
  req.session.user = null;
  $.result(res, {});
}


export default UserAPI
