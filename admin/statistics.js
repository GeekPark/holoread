/**
 * @author jk
 * @version 1.0.0
 */

import Models from '../models';
import $      from '../utils';

const V1 = Models;

export default {
  total: async function (req, res, next) {
    const user       = await V1.UserModel.count({});
    const article    = await V1.ArticleModel.count({});
    const comment    = await V1.CommentModel.count({});
    const log        = await V1.LogModel.count({});
    const vote       = await V1.VoteModel.count({});
    const question   = await V1.QuestionModel.count({});
    const docs = {
      user,
      article,
      comment,
      log,
      vote,
      question,
    }
    $.result(res, docs || {});
  }
}
