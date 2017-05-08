/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const VoteModel       = Models.VoteModel;
const VoteRecordModel = Models.VoteRecordModel;

const VoteAPI = new Base({
  model:  VoteModel,
  search: 'title'
})

VoteAPI.create = VoteAPI.addSchedule;

const VoteRecordAPI = new Base({
  model:  VoteRecordModel,
  search: 'title'
})


export default {
  vote:   VoteAPI,
  record: VoteRecordAPI
}
