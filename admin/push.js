/**
 * @author jk
 * @version 1.0.0
 */

import $      from '../utils';
import jpush  from '../utils/jpush';
import Models from '../models';
import Base   from './base'

const PushModel = Models.PushModel;
const PushAPI   = new Base({
  model: PushModel,
  search: 'content'
})


PushAPI.show = async function (req, res, next) {
  $.result(res, await PushModel.find({ _id: req.params.id }));
}

PushAPI.index = async function (req, res, next) {
  let query = {}
  if (!$.isEmpty(req.query.status)) query = { 'status': req.query.status };
  $.result(res, await PushModel.all(query, req.query.start));
}

PushAPI.create = async function (req, res, next) {
  req.body.user = req.session.user._id;
  let documents = await PushModel.create(req.body);
  if (documents === -1) return $.result(res, 'create failed');

  if (req.body.now) { // 立刻推送
    let result = await jpush.push(documents.content);
    let updateDoc = await PushModel.update({ "_id": documents._id }, {
      status: 'push',
      messageId: result.msg_id
    });
  } else if (!$.isEmpty(req.body.pushAt)) {
    // 定时推送 写入 schedule
    let result = await jpush.schedule.add(
      documents.content, $.dateformat(documents.pushAt), documents.content
    );
    let newDate = new Date(documents.pushAt);
    newDate.setSeconds(newDate.getSeconds() + 10);
    let j = $.job.add(newDate, function () {
      PushModel.update({ "_id": documents._id }, { status: 'push' });
    })
    let updateDoc = await PushModel.update({ "_id": documents._id }, {
      status: 'notpush',
      scheduleId: result.schedule_id
    });
  }

  $.result(res, documents);
}

PushAPI.update = async function (req, res, next) {
  let documents = await PushModel.update({ "_id": req.params.id }, req.body)
  if (documents === -1) $.result(res, 'update failed');
  else $.result(res, documents);
}

PushAPI.del = async function (req, res, next) {
  if (!$.isEmpty(req.body.scheduleId)) {
    console.log('delete');
    jpush.schedule.delete(req.body.scheduleId);
  }
  let documents = await PushModel.delete({ "_id": req.params.id })
  if (documents === -1) $.result(res, 'delete failed');
  else $.result(res, documents);
}

export default PushAPI
