import {request, v1, mock} from '../tools'
import Base from './base'


const {_get, _delete, _post} = new Base({});
let user     = {};


describe('ADMIN: FOLLOW',  () => {

  it('create follow', async () => {
    const user = await mock.create('user');
    const article = await mock.create('article');
    return _post('follows', {
      from :user.id,
      article: article.id
    }, 200);
  });

  it('repeat follow', async () => {
    const user = await mock.create('user');
    const article = await mock.create('article');
    return _post('follows', {
      from :user.id,
      article: article.id
    }, 400);
  });

  it('access to all follows', () => {
    return _get('follows', {start: 0}, 200);
  });
});
