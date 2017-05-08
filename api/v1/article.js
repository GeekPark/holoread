/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'

const {ArticleModel, LikeModel, CommentModel, } = Models;


export default new Base({

  model: ArticleModel,

  myArticles: async function (req, res, next) {
    const query = Object.assign({}, req.query);
    $.result(res, await ArticleModel.all(query));
  },

  myLikes: async function (req, res, next) {
    const query = Object.assign({
      ariticle: {$exists: true},
    }, req.query);
    $.result(res, await LikeModel.all(query));
  },

  myComments: async function (req, res, next) {
    const query = Object.assign({
      ariticle: {$exists: true},
    }, req.query);
    $.result(res, await CommentModel.all(query));
  },

})
