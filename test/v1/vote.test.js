import {request, v1, mock} from '../tools'
import Base from './base'


const {_get} = new Base({});
let user     = {};


describe('GET VOTE',  () => {

  it('获取所有投票, 正确', () => {
    return _get('votes', {start: 0}, 200);
  });

  it('获取投票, 正确', async () => {
    const vote = await mock.create('vote');
    return _get(`vote/${vote._id}`, {}, 200);
  });

  it('获取发布过的投票, 正确', async () => {
    user = await mock.create('user');
    return _get('votes/myvotes', {user: user._id.toString()}, 200);
  });

  it('获取喜欢过的投票, 正确', async () => {
    return _get('votes/myLikes', {user: user._id.toString()}, 200);
  });

  it('获取评论过的投票, 正确', async () => {
    return _get('votes/myComments', {user: user._id.toString()}, 200);
  });

});
