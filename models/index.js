import mongoose        from 'mongoose'
import $               from '../utils'
import UserModel       from './user'
import ArticleModel    from './article'
import CommentModel    from './comment'
import LogModel        from './log'
import VoteModel       from './vote'
import VoteRecordModel from './voterecord'
import QuestionModel   from './question'
import LikeModel       from './like'
import PushModel       from './push'
import ActivityModel   from './activity'

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
  CommentModel,
  LogModel,
  VoteModel,
  VoteRecordModel,
  QuestionModel,
  LikeModel,
  PushModel,
  ActivityModel,
}
