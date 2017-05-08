/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';

String.prototype.firstUpperCase= function() {
  return this.replace(/^\S/,function(s){return s.toUpperCase();});
}


export default async function (req, res, next) {

  let  query = {};
  query[req.query.searchKey] =  { $regex: req.query.searchVal, $options: 'i' };

  const model = Models[`${req.query.model}Model`];

  if ($.isEmpty(model)) {return $.result(res, 'error');}
  const docs = await model.all(query, req.query.start);
  $.result(res, docs);
}

