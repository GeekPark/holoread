/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'


const {LikeModel} = Models;


export default {
  create: async (req, res, next) => {
    let result = {}
    let documents = await LikeModel.find(req.body)
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
}
