
import {request, v1, mock} from '../tools'
import Base from './base'


const {_post, _get, _delete} = new Base({});
let user      = {};



describe('ADMIN: USER',  () => {
  it('create user', async () => {
    return _post('users', mock.generate.user(), 200);
  });

  it('access to all users', async () => {
    return _post('users', mock.generate.user(), 200);
  });

  it('show user', async () => {
    const user = await mock.create('user');
    return _get(`users/${user._id}`, {}, 200);
  });

  // it('delete user', async () => {
  //   const user = await mock.create('user');
  //   return _delete(`users/${user._id}`, {}, 200);
  // });
});

describe('ADMIN: ACCOUNT', () => {
  it('user login', async () => {
    const user = await mock.create('user');
    return _post('account/login', {
      email: user.email,
      password: user.password
    }, 200);
  });

  it('user logout', async () => {
    return _post('account/logout', {}, 200);
  });
})
