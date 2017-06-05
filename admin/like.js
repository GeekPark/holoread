/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const LikeModel = Models.LikeModel;
const LikeAPI   = new Base(LikeModel);

LikeAPI.create = async (req, res, next)=> {
  const query = Object.assign({}, req.body);
  const exist = await LikeModel.find(query);
  if ($.empty(exist) === false) {return $.result(res, 'create failed');}
  $.result(res, await LikeModel.create(query));
};

export default LikeAPI
