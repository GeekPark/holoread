/**
 * @author jk
 * @version 1.0.0
 */

import $      from '../../utils';
import auth   from '../../utils/auth';
import Models from '../../models';


const {UserModel} = Models;


export default {
  // 登录
  login: async (req, res, next) => {

    let exist = await UserModel.find({openid: req.body.openid});

    // 如果不存在, 就创建用户
    if ($.isEmpty(exist)) {
      exist = await UserModel.create(req.body);
      return $.result(res, exist);
    }
    // 如果存在 检查状态
    else if (exist.status === -1) {
      return $.result(res, `status: ${exist.status}`);
    }

    $.result(res, exist);
  },


  // 验证邀请码
  verify: async (req, res, next) => {

    let exist = await UserModel.find({
      openid: req.body.openid,
      code:   req.body.code
    });

    if ($.isEmpty(exist)) { return $.result(res, 'not match'); }

    // 如果用户未激活 并且验证码正确, 则登录成功
    else if (exist.status === -1) {
      exist = await UserModel.update({
        _id: exist._id}, { status: 1 });
      $.result(res, exist);
    }

  }

}
