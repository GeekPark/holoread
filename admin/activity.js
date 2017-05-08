/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const ActivityModel = Models.ActivityModel;
const ActivityAPI = new Base({
  model: ActivityModel,
  search: 'title'
})

ActivityAPI.create = ActivityAPI.addSchedule;

export default ActivityAPI
