import {request, v1, mock} from '../tools'
import Base from './base'


const {_get, _delete, _post} = new Base({});
let user     = {};


describe('ADMIN: ARTICLE',  () => {

  it('create article', async () => {
    return _post('articles', await mock.generate.article(), 200);
  });

  it('access to all articles', () => {
    return _get('articles', {start: 0}, 200);
  });

  it('show article', async () => {
    const article = await mock.create('article');
    return _get(`articles/${article._id}`, {}, 200);
  });

  it('delete article', async () => {
    const article = await mock.create('article');
    return _delete(`articles/${article._id}`, {}, 200);
  });
});

