/**
 * @author eric
 * @version 1.0.0
 */

import $      from '../../utils';
import auth   from '../../utils/auth';
import Models from '../../models';


const {UserModel} = Models;


export default {
  // 登录
  // 如果不存在就创建新用户
   wechatLogin: async (req, res, next) => {

    let exist = await UserModel.find({openid: req.body.openid});

    if ($.empty(exist)) { exist = await UserModel.create(req.body); }

    $.result(res, exist);
  },

  verifySms: async (req, res, next) => {
    const { error, value } = $.paramter.validate(req.body,
    $.paramter.object().keys({
      phone: $.paramter.string(),
      code: $.paramter.string()
    }).with('phone', 'code'));
    if (error) return $.result(res, 'params error');

    let exist = await UserModel.find({ phone: value.phone});
    if ($.empty(exist)) { return $.result(res, 'not match'); }
    if (value.code === exist.sms.code &&
      exist.sms.time > Date.now()) {
      return $.result(res, "验证成功", 200);
    }
    $.result(res, '验证失败');
  },

  // 短信验证码
  createSms: async (req, res, next) => {
    const code = $.createCode();
    const {phone} = req.body;

    if ($.empty(phone)) {return $.result(res, '发送失败');}

    let exist = await UserModel.find({phone: phone});

    if ($.empty(exist)) {
      exist = await UserModel.create({phone: phone});
    }

    exist.sms = {
      code: code,
      time: $.DateAdd("m", 30, new Date())
    }

    await UserModel.update(exist);
    const result = await $.createSms(phone, code);

    if (result === -1) {return $.result(res, '发送失败');}
    $.result(res, '发送成功', 200);
  }

}
