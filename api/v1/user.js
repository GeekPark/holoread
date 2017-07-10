/**
 * @author eric
 * @version 1.0.0
 */

import $      from '../../utils';
import auth   from '../../utils/auth';
import Models from '../../models';
import nodemailer from 'nodemailer';

const {sign} = auth;
const {UserModel} = Models;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport($.config.email);

export default {
  // 登录
  // 如果不存在就创建新用户
   wechatLogin: async (req, res, next) => {
    if ($.empty(req.body.openid)) {
      return $.result(res, 'openid error');
    }
    let exist = await UserModel.find({openid: req.body.openid});
    if ($.empty(exist)) {
      const result = await UserModel.create(req.body);
      result.token = sign({_id: result._id});
      const update = await UserModel.update(result);
      $.debug(update);
      $.result(res, update);
    } else {
      $.result(res, exist);
    }
  },

  verifySms: async (req, res, next) => {
    const { error, value } = $.paramter.validate(req.body,
                             $.paramter.object().keys({
                               openid: $.paramter.string(),
                               phone: $.paramter.string(),
                               code: $.paramter.string()
                             }).with('phone', 'code'));
    if (error) return $.result(res, 'params error');

    if (value.code === $.config.testCode) {return $.result(res, "test", 200);}

    let exist = await UserModel.find({openid: value.openid});
    if ($.empty(exist)) { return $.result(res, 'not match'); }
    if (value.code === exist.sms.code &&
        exist.sms.time > Date.now()) {
      exist.phone = value.phone;
      await UserModel.update(exist);
      return $.result(res, "验证成功", 200);
    }
    $.result(res, '验证失败');
  },

  // 短信验证码
  createSms: async (req, res, next) => {
    const code = $.createCode();
    const {phone, openid} = req.body;
    const sms = {code: code, time: $.DateAdd("mi", 30, new Date())};

    if ($.empty(phone) || $.empty(openid) ) {return $.result(res, '缺少 phone / openid');}

    let exist = await UserModel.find({phone: phone});

    if ($.empty(exist)) {
      exist = await UserModel.updateBy({openid: openid}, {sms: sms});
    } else {
      return $.result(res, '已经绑定其他账号');
    }

    const result = await $.createSms(phone, code);
    if (result === -1) {return $.result(res, '发送失败');}
    $.result(res, '发送成功', 200);
  },

  feedback: async (req, res, next) => {
    const {content = '', email = ''} = req.body;

    const mailOptions = {
      from: `HOLOREAD 👻 <${$.config.email.auth.user}>`, // sender address
      to: $.config.email.receiver, // list of receivers
      subject: `[ HOLOREAD 意见反馈 ]`, // Subject line
      text: '', // plain text body
      html: `<p>${content} <p>${email}</p></p>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return $.debug(error);
      $.debug('Message %s sent: %s', info.messageId, info.response);
      $.result(res, info.response, 200);
    });
  }
}
