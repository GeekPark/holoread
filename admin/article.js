/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const ArticleModel = Models.ArticleModel;
const LikeModel    = Models.LikeModel;

const ArticleAPI = new Base(ArticleModel);

ArticleAPI.index = async function (req, res, next) {
   const list = await ArticleModel.all({}, req.query || {});
   const count = await ArticleModel.count();
   $.result(res, {
    list: list,
    meta: {
      total_count: count,
      limit_value: 20,
    }
  });
}

export default ArticleAPI
