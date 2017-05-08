/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const LikeModel = Models.LikeModel;
const LikeAPI   = new Base({
  model: LikeModel,
  search: 'content'
})

LikeAPI.create = async function (req, res, next) {
  let result = {}
  let documents = await LikeModel.find({ article: req.body.article, user: req.body.user })
  if ($.isEmpty(documents)) {
    result.action = 'up';
    documents = await LikeModel.create(req.body);
  } else {
    result.action = 'down';
    documents = await LikeModel.delete({ _id: documents._id });
  }
  if (documents === -1) return $.result(res, 'like failed');
  result.documents = documents;
  $.result(res, result);
}

export default LikeAPI
