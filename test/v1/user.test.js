
import {request, v1, mock} from '../tools'
import Base from './base'


const {_post} = new Base({});
let user      = {};

describe('USER LOGIN',  () => {

  it('用户登录, 未激活, 返回-1', async () => {
    user = await mock.create('user');
    return _post('user/login', {openid: user.openid}, 400);
  });
});


describe('USER VERIFY',  () => {

  it('用户登录, 准备激活, 输入错误激活码, 激活失败', async () => {
    const reqData = {openid: user.openid, code: 'foo'};
    return _post('user/verify', reqData, 400);
  });

  it('用户登录, 准备激活, 输入正确激活码, 激活成功', async () => {
    const reqData    = {openid: user.openid, code: mock.verifyCode};
    return _post('user/verify', reqData, 200);
  });
});


describe('USER LOGIN',  () => {

  it('用户登录, 已激活成功, 登录成功', async () => {
    return _post('user/login', {openid: user.openid}, 200);
  });
});
