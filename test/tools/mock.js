// 脚手架 生成测试数据
//
require('babel-core/register');
require("babel-polyfill");

import M      from '../../models'
import faker  from 'faker'
import $      from '../../utils'
import cipher from '../../utils/cipher'

faker.locale  = 'zh_CN';
const objects = {};

const generate = {
  user: () => {
    return {
      nickname:   faker.name.findName(),
      openid:     faker.random.uuid(),
      email:      faker.internet.email(),
      password:   faker.internet.password(),
      permission: ['dev']
    };
  },
  article: async () => {
    if (!objects.user) {
      objects.user = await methods.create_user();
    }
    return {
      origin_title: faker.lorem.words(),
      user:         objects.user._id.toString(),
    };
  },
  log: async () => {
    if (!objects.user) {
      objects.user = await methods.create_user();
    }
    return {
      event: 'some',
      user:  objects.user._id.toString(),
    };
  }
}

const methods  = {
  create_user: async () => {
    let user = generate.user();
    user.password = cipher.encode(user.password);
    user = await M.UserModel.create(user);
    user.password = cipher.decode(user.password);
    return user;
  },

  create_article:  async () => {
    return await M.ArticleModel.create(generate.article());
  },

  create_log: async () => {
    return await M.LogModel.create(generate.log());
  }
}

export default {

  methods,

  generate,

  create: async (key) => {
    if (!objects['user']) {
      objects.user = await methods.create_user();
    } else if (key === 'user') {
      return objects.user;
    }

    if (objects[key]) return objects[key];
    const method = methods[`create_${key}`];
    const obj = await method();
    objects[key] = obj;
    return obj;
  },
}
