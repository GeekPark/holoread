import mongoose     from 'mongoose'
import $            from '../utils'
import UserModel    from './user'
import ArticleModel from './article'
import LogModel     from './log'
import FollowModel  from './follow'
import AccessModel  from './access'

const dbname = process.env.NODE_ENV === 'test' ? $.config.testdb : $.config.db;

export default {
  connect:  () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(dbname, {
      server: { poolSize: 20 }
    }, (err) => {
      $.info(dbname);
      if (err) {
        $.error(`connect to ${$.config.db} error: ${err.message}`)
        process.exit(1);
      }
      return mongoose.connection;
    });
  },
  UserModel,
  ArticleModel,
  LogModel,
  FollowModel,
  AccessModel
}
