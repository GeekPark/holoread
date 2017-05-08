/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'


const {VoteModel, LikeModel, CommentModel} = Models;


export default new Base({
  model: VoteModel,

  myVotes: async function (req, res, next) {
    const query = Object.assign({}, req.query);
    $.result(res, await VoteModel.all(query));
  },

  myLikes: async function (req, res, next) {
    const query = Object.assign({
      vote: {$exists: true},
    }, req.query);
    $.result(res, await LikeModel.all(query));
  },

  myComments: async function (req, res, next) {
    const query = Object.assign({
      vote: {$exists: true},
    }, req.query);
    $.result(res, await CommentModel.all(query));
  },
})
