import {request, v1, mock} from '../tools'
import Base from './base'


const {_get} = new Base({});
let user     = {};


describe('GET QUESTION',  () => {

  it('获取所有问答, 正确', () => {
    return _get('questions', {start: 0}, 200);
  });

  it('获取问答, 正确', async () => {
    const question = await mock.create('question');
    return _get(`question/${question._id}`, {}, 200);
  });

  it('获取发布过的问答, 正确', async () => {
    user = await mock.create('user');
    return _get('questions/myQuestions', {user: user._id.toString()}, 200);
  });

  it('获取喜欢过的问答, 正确', async () => {
    return _get('questions/myLikes', {user: user._id.toString()}, 200);
  });

  it('获取评论过的问答, 正确', async () => {
    return _get('questions/myComments', {user: user._id.toString()}, 200);
  });

});
