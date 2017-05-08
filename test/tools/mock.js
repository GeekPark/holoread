// 脚手架 生成测试数据
//
require('babel-core/register');
require("babel-polyfill");

import Models from '../../models'
import faker  from 'faker'
import $      from '../../utils'

faker.locale  = 'zh_CN';

const M     = Models;
let objects = {
  verifyCode : faker.random.word(),
};


const methods  = {
  create_user: async () => {
    return await M.UserModel.create({
      nickname:   faker.name.findName(),
      openid:     faker.random.uuid(),
      email:      {addr: faker.internet.email()},
      password:   faker.internet.password(),
      permission: ['dev'],
      code:       objects.erifyCode,
    });
  },

  create_article:  async () => {
    return await M.ArticleModel.create({
      title:    faker.lorem.words(),
      subTitle: faker.lorem.words(),
      content:  faker.lorem.words(),
      user:     objects.user._id.toString(),
    });
  },

  create_comment: async () => {
    return await M.CommentModel.create({
      content: faker.lorem.words(),
      article: objects.article._id.toString(),
      user:    objects.user._id.toString(),
    });
  },

  create_vote: async () => {
     return await M.VoteModel.create({
       title:       faker.lorem.words(),
       points:      [faker.lorem.words()],
       user:        objects.user._id.toString(),
       multiSelect: false,
    })
  },

  create_question: async () => {
     return await M.QuestionModel.create({
       title:       faker.lorem.words(),
       description: faker.lorem.words(),
       user:        objects.user._id.toString(),
    })
  },
}




export default {

  methods,

  create: async (key) => {
    if (!objects['user']) {
      objects.user = await methods.create_user();
    }

    if (objects[key]) return objects[key];

    const method = methods[`create_${key}`];
    const obj = await method();
    objects[key] = obj;
    return obj;
  },
}
