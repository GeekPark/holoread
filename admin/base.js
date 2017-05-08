/**
 * @author jk
 * @version 1.0.0
 */
import $ from '../utils';

export default class Base {
  constructor(model = {}) {
    this.model = model;
    addMethods(this);
  }
}


function addMethods(_this) {

  _this.show = async function (req, res, next) {
    $.result(res, await _this.model.findById(req.params.id));
  }

  _this.index = async function (req, res, next) {
    const list = await _this.model.all({}, req.query);
    const count = await _this.model.count();
    $.result(res, {
      list: list,
      meta: {
        total_count: count,
        limit_value: 20,
      }
    });
  }

  _this.create = async function (req, res, next) {
    $.result(res, await _this.model.create(req.body));
  }

  _this.update = async function (req, res, next) {
    let docs = await _this.model.update({ "_id": req.params.id }, req.body)
    if (docs === -1) $.result(res, 'update failed');
    else $.result(res, docs);
  }

  _this.del = async function (req, res, next) {
    let docs = await _this.model.delete({ "_id": req.params.id })
    if (docs === -1) $.result(res, 'delete failed');
    else $.result(res, docs);
  }

  _this.schedule = async function (req, res, next) {
    const doc    = await _this.model.create(req.body);
    if (doc === -1) {return $.result(res, 'params error');}
    if ($.isEmpty(req.body.autoPublishAt)) {
      return $.result(res, doc);
    }

    doc.job = $.job.add(req.body.autoPublishAt, () => {
        doc.state = 'published';
        doc.save();
    })
    doc.save();
    $.result(res, doc);
  }
}
