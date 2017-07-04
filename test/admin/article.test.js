import {request, admin, v1, mock} from '../tools'
import Base from './base'


const {_get, _delete, _post} = new Base({});
let user = {};


describe('ADMIN: ARTICLE',  function (){

  it('create article', async () => {
    return _post('articles', await mock.generate.article(), 200);
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

