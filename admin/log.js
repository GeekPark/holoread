/**
 * @author jk
 * @version 1.0.0
 */
import $      from '../utils';
import Models from '../models';
import Base   from './base';

const LogModel = Models.LogModel;
const LogAPI   = new Base({
  model: LogModel,
  search: 'title'
})

export default LogAPI
