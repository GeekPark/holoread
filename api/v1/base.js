/**
 * @author jk
 * @version 1.0.0
 */
import $ from '../../utils'


export default class Base {
  constructor(options) {

    this.model = options.model;

    addMethods(this);

    Object.keys(options).forEach(el => {
      this[el] = options[el];
    })
  }
}


const addMethods = (_this) => {
  _this.find = async function (req, res, next) {
    return $.result(res, await _this.model.find({'_id': req.params.id}));
  };

  _this.all = async function (req, res, next) {
    $.result(res, await _this.model.all({}, req.query.start));
  };

  _this.create = async function (req, res, next) {
    let documents = await _this.model.create(req.body);
    if (documents === -1) $.result(res, 'create failed');
    else $.result(res, documents);
  };

  _this.update =  async function (req, res, next) {
    let documents = await _this.model.update({"_id": req.params.id}, req.body)
    if (documents === -1) $.result(res, 'update failed');
    else $.result(res, documents);
  };

  _this.delete = async function (req, res, next) {
    let documents = await _this.model.delete({"_id": req.params.id})
    if (documents === -1) $.result(res, 'delete failed');
    else $.result(res, documents);
  };
}
