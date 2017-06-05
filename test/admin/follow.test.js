import {request, v1, mock} from '../tools'
import Base from './base'


const {_get, _delete, _post} = new Base({});
let user     = {};


describe('ADMIN: Like',  () => {

  it('create Like', async () => {
    const user = await mock.create('user');
    const article = await mock.create('article');
    return _post('likes', {
      from :user._id,
      article: article._id
    }, 200);
  });

  it('repeat Like', async () => {
    const user = await mock.create('user');
    const article = await mock.create('article');
    return _post('likes', {
      from :user._id,
      article: article._id
    }, 400);
  });

  it('access to all likes', () => {
    return _get('likes', {start: 0}, 200);
  });
});
