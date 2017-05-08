/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const CommentModel = Models.CommentModel;
const CommentAPI   = new Base({
  model: CommentModel,
  search: 'title'
})

CommentAPI.index = async function (req, res, next) {
  $.result(res, await CommentModel.all({}, req.query.start));
}

export default CommentAPI

