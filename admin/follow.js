/**
 * @author eric
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const FollowModel = Models.FollowModel;
const FollowAPI   = new Base(FollowModel);

FollowAPI.create = async (req, res, next)=> {
  const query = Object.assign({}, req.body);
  const exist = await FollowModel.find(query);
  if ($.empty(exist) === false) {return $.result(res, 'create failed');}
  $.result(res, await FollowModel.create(query));
};

export default FollowAPI
