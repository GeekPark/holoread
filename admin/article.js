/**
 * @author jk
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

ArticleAPI.create = ArticleAPI.schedule;

// 更改索引
// ArticleAPI.updateIndex = async function (req, res, next) {
//   if (req.body.items.length === 0) return $.result(res, {});
//   else req.body.items.forEach(async (el, index) => {
//     let documents = await ArticleModel.update({
//       _id: el.id
//     }, { _index: el.index })
//     if (index === req.body.items.length - 1) { return $.result(res, {}); }
//   })
// }

ArticleAPI.del = async function (req, res, next) {
  let documents = await ArticleModel.findById(req.params.id);
  documents && documents.job && documents.job.cancel();
  documents = await ArticleModel.delete({ "_id": req.params.id });
  if (documents === -1) $.result(res, 'delete failed');
  else $.result(res, documents);
}

export default ArticleAPI
