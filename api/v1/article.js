/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../../utils'
import Models from '../../models'
import Base   from './base'

const {ArticleModel} = Models;

export default {

  index: async (req, res, next) => {
    const list = await ArticleModel.all({}, req.query);
    const count = await ArticleModel.count();
    $.result(res, {
      list: list,
      meta: {
        total_count: count,
        limit_value: 20,
      }
    });
  }
}
