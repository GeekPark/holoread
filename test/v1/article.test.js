import {request, v1, mock} from '../tools'
import Base from './base'


const {_get} = new Base({});
let user     = {};


describe('GET ARTICLE',  () => {

  it('获取所有文章, 正确', () => {
    return _get('articles', {start: 0}, 200);
  });

  it('获取文章, 正确', async () => {
    const article = await mock.create('article');
    return _get(`article/${article._id}`, {}, 200);
  });

  it('获取发布过的文章, 正确', async () => {
    user = await mock.create('user');
    return _get('articles/myArticles', {user: user._id.toString()}, 200);
  });

  it('获取喜欢过的文章, 正确', async () => {
    return _get('articles/myLikes', {user: user._id.toString()}, 200);
  });

  it('获取评论过的文章, 正确', async () => {
    return _get('articles/myComments', {user: user._id.toString()}, 200);
  });

});

